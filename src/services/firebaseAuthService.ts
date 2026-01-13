// Firebase Authentication Service
// Handles user authentication with Firebase Auth + Firestore user profiles

import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    User as FirebaseUser,
    updateProfile
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../config/firebase';
import { firestoreService } from './firestoreService';
import type { User, UserRole, Tenant } from '../types';

// Local storage keys for fallback (when Firebase not configured)
const STORAGE_KEY = 'akshata_users';
const CURRENT_USER_KEY = 'akshata_current_user';

class FirebaseAuthService {
    private static instance: FirebaseAuthService;
    private currentUser: User | null = null;
    private authListeners: ((user: User | null) => void)[] = [];

    static getInstance(): FirebaseAuthService {
        if (!FirebaseAuthService.instance) {
            FirebaseAuthService.instance = new FirebaseAuthService();
        }
        return FirebaseAuthService.instance;
    }

    constructor() {
        // Listen to Firebase auth state changes
        if (isFirebaseConfigured()) {
            onAuthStateChanged(auth, async (firebaseUser) => {
                if (firebaseUser) {
                    // User is signed in - get or create user profile
                    const user = await this.getOrCreateUserProfile(firebaseUser);
                    this.setCurrentUser(user);
                } else {
                    this.setCurrentUser(null);
                }
            });
        } else {
            // Fallback: Load from localStorage
            this.loadFromLocalStorage();
        }
    }

    private loadFromLocalStorage(): void {
        const stored = localStorage.getItem(CURRENT_USER_KEY);
        if (stored) {
            try {
                this.currentUser = JSON.parse(stored);
            } catch {
                this.currentUser = null;
            }
        }
    }

    private setCurrentUser(user: User | null): void {
        this.currentUser = user;
        if (user) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(CURRENT_USER_KEY);
        }
        // Notify all listeners
        this.authListeners.forEach(listener => listener(user));
    }

    // Subscribe to auth state changes
    onAuthStateChange(callback: (user: User | null) => void): () => void {
        this.authListeners.push(callback);
        // Immediately call with current state
        callback(this.currentUser);

        // Return unsubscribe function
        return () => {
            this.authListeners = this.authListeners.filter(l => l !== callback);
        };
    }

    // Get current user
    getCurrentUser(): User | null {
        return this.currentUser;
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return this.currentUser !== null;
    }

    // Check if user is admin/owner
    isAdmin(): boolean {
        return this.currentUser?.role === 'owner' || this.currentUser?.role === 'superadmin';
    }

    // Google Sign In
    async signInWithGoogle(): Promise<User> {
        if (!isFirebaseConfigured()) {
            throw new Error('Firebase not configured. Please set up Firebase credentials.');
        }

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = await this.getOrCreateUserProfile(result.user);
            return user;
        } catch (error: any) {
            console.error('Google sign-in error:', error);
            throw new Error(error.message || 'Failed to sign in with Google');
        }
    }

    // Email/Password Sign Up
    async signUpWithEmail(email: string, password: string, name: string): Promise<User> {
        if (!isFirebaseConfigured()) {
            // Fallback to localStorage
            return this.localSignUp(email, password, name);
        }

        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Update display name
            await updateProfile(result.user, { displayName: name });

            const user = await this.getOrCreateUserProfile(result.user, name);
            return user;
        } catch (error: any) {
            console.error('Sign up error:', error);
            if (error.code === 'auth/email-already-in-use') {
                throw new Error('Email already registered. Please sign in.');
            }
            throw new Error(error.message || 'Failed to create account');
        }
    }

    // Email/Password Sign In
    async signInWithEmail(email: string, password: string): Promise<User> {
        if (!isFirebaseConfigured()) {
            // Fallback to localStorage
            return this.localSignIn(email, password);
        }

        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const user = await this.getOrCreateUserProfile(result.user);
            return user;
        } catch (error: any) {
            console.error('Sign in error:', error);
            if (error.code === 'auth/user-not-found') {
                throw new Error('No account found with this email.');
            }
            if (error.code === 'auth/wrong-password') {
                throw new Error('Incorrect password.');
            }
            throw new Error(error.message || 'Failed to sign in');
        }
    }

    // Sign Out
    async signOut(): Promise<void> {
        if (isFirebaseConfigured()) {
            await signOut(auth);
        }
        this.setCurrentUser(null);
    }

    // Get or create user profile in Firestore
    private async getOrCreateUserProfile(
        firebaseUser: FirebaseUser,
        displayName?: string
    ): Promise<User> {
        // Try to get existing user
        let user = await firestoreService.getUserByEmail(firebaseUser.email || '');

        if (!user) {
            // Create new user
            user = await firestoreService.createUser({
                name: displayName || firebaseUser.displayName || 'User',
                email: firebaseUser.email || '',
                ...(firebaseUser.photoURL && { avatar: firebaseUser.photoURL }),
                role: 'customer', // Default role
                lastLogin: new Date().toISOString()
            });
        } else {
            // Update last login
            await firestoreService.updateUser(user.id, {
                lastLogin: new Date().toISOString(),
                ...(firebaseUser.photoURL && { avatar: firebaseUser.photoURL })
            });
        }

        return user;
    }

    // Register as business owner (creates tenant)
    async registerBusinessOwner(
        businessName: string,
        email: string,
        password: string,
        ownerName: string
    ): Promise<{ user: User; tenant: Tenant }> {
        // Create user account first
        const user = await this.signUpWithEmail(email, password, ownerName);

        // Create tenant/business
        const slug = businessName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const tenant = await firestoreService.createTenant({
            name: businessName,
            slug,
            ownerId: user.id,
            isActive: true
        });

        // Update user role to owner and link to tenant
        await firestoreService.updateUser(user.id, {
            role: 'owner',
            tenantId: tenant.id
        });

        // Create default business settings
        await firestoreService.saveBusinessSettings(tenant.id, {
            parlorName: businessName,
            ownerName: ownerName,
            contactNumber: '',
            address: '',
            city: '',
            homeServiceEnabled: false,
            homeServiceExtraCharge: 0,
            workingHours: { start: '09:00', end: '18:00' },
            workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            emailNotificationEnabled: true
        });

        const updatedUser = { ...user, role: 'owner' as UserRole, tenantId: tenant.id };
        this.setCurrentUser(updatedUser);

        return { user: updatedUser, tenant };
    }

    // ==================== LOCAL STORAGE FALLBACK ====================

    private localSignUp(email: string, password: string, name: string): User {
        const users = this.getLocalUsers();

        if (users[email]) {
            throw new Error('Email already registered. Please sign in.');
        }

        const user: User = {
            id: email.replace(/[^a-zA-Z0-9]/g, '_'),
            name,
            email,
            role: 'customer',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };

        users[email] = { ...user, password };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        this.setCurrentUser(user);
        return user;
    }

    private localSignIn(email: string, password: string): User {
        const users = this.getLocalUsers();
        const userData = users[email];

        if (!userData) {
            throw new Error('No account found with this email.');
        }

        if (userData.password !== password) {
            throw new Error('Incorrect password.');
        }

        const { password: _, ...user } = userData;
        user.lastLogin = new Date().toISOString();
        users[email] = { ...userData, lastLogin: user.lastLogin };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        this.setCurrentUser(user);
        return user;
    }

    private getLocalUsers(): Record<string, any> {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    }
}

export const firebaseAuthService = FirebaseAuthService.getInstance();
export default FirebaseAuthService;
