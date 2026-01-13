// Firestore Database Service
// Handles all database operations for the SaaS platform

import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    Timestamp,
    DocumentData,
    QueryConstraint
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import type { Tenant, User, Service, Appointment, Review, BusinessSettings } from '../types';

// Collection names
const COLLECTIONS = {
    TENANTS: 'tenants',
    USERS: 'users',
    SERVICES: 'services',
    APPOINTMENTS: 'appointments',
    REVIEWS: 'reviews',
    SETTINGS: 'settings'
} as const;

// Helper to generate unique IDs
const generateId = (): string => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Helper to convert Firestore timestamp to ISO string
const timestampToISO = (timestamp: Timestamp | string | undefined): string => {
    if (!timestamp) return new Date().toISOString();
    if (typeof timestamp === 'string') return timestamp;
    return timestamp.toDate().toISOString();
};

class FirestoreService {
    private static instance: FirestoreService;

    static getInstance(): FirestoreService {
        if (!FirestoreService.instance) {
            FirestoreService.instance = new FirestoreService();
        }
        return FirestoreService.instance;
    }

    // Check if Firebase is properly configured
    isConfigured(): boolean {
        return isFirebaseConfigured();
    }

    // ==================== TENANT OPERATIONS ====================

    async createTenant(data: Omit<Tenant, 'id' | 'createdAt'>): Promise<Tenant> {
        const id = generateId();
        const tenant: Tenant = {
            ...data,
            id,
            createdAt: new Date().toISOString(),
            isActive: true,
            subscriptionPlan: 'free',
            subscriptionStatus: 'active'
        };

        await setDoc(doc(db, COLLECTIONS.TENANTS, id), tenant);
        return tenant;
    }

    async getTenant(tenantId: string): Promise<Tenant | null> {
        const docRef = doc(db, COLLECTIONS.TENANTS, tenantId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? (docSnap.data() as Tenant) : null;
    }

    async getTenantBySlug(slug: string): Promise<Tenant | null> {
        const q = query(
            collection(db, COLLECTIONS.TENANTS),
            where('slug', '==', slug),
            where('isActive', '==', true),
            limit(1)
        );
        const snapshot = await getDocs(q);
        return snapshot.empty ? null : (snapshot.docs[0].data() as Tenant);
    }

    async getTenantByOwnerId(ownerId: string): Promise<Tenant | null> {
        const q = query(
            collection(db, COLLECTIONS.TENANTS),
            where('ownerId', '==', ownerId),
            limit(1)
        );
        const snapshot = await getDocs(q);
        return snapshot.empty ? null : (snapshot.docs[0].data() as Tenant);
    }

    async updateTenant(tenantId: string, data: Partial<Tenant>): Promise<void> {
        const docRef = doc(db, COLLECTIONS.TENANTS, tenantId);
        await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
    }

    // ==================== USER OPERATIONS ====================

    async createUser(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
        const id = data.email.replace(/[^a-zA-Z0-9]/g, '_'); // Use email-based ID
        const user: User = {
            ...data,
            id,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };

        await setDoc(doc(db, COLLECTIONS.USERS, id), user);
        return user;
    }

    async getUser(userId: string): Promise<User | null> {
        const docRef = doc(db, COLLECTIONS.USERS, userId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? (docSnap.data() as User) : null;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const q = query(
            collection(db, COLLECTIONS.USERS),
            where('email', '==', email),
            limit(1)
        );
        const snapshot = await getDocs(q);
        return snapshot.empty ? null : (snapshot.docs[0].data() as User);
    }

    async updateUser(userId: string, data: Partial<User>): Promise<void> {
        const docRef = doc(db, COLLECTIONS.USERS, userId);
        await updateDoc(docRef, data);
    }

    // ==================== SERVICE OPERATIONS ====================

    async createService(tenantId: string, data: Omit<Service, 'id' | 'tenantId' | 'createdAt'>): Promise<Service> {
        const id = generateId();
        const service: Service = {
            ...data,
            id,
            tenantId,
            isActive: true,
            createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, COLLECTIONS.SERVICES, id), service);
        return service;
    }

    async getServices(tenantId: string, activeOnly: boolean = true): Promise<Service[]> {
        const constraints: QueryConstraint[] = [
            where('tenantId', '==', tenantId),
            orderBy('category'),
            orderBy('name')
        ];

        if (activeOnly) {
            constraints.push(where('isActive', '==', true));
        }

        const q = query(collection(db, COLLECTIONS.SERVICES), ...constraints);
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as Service);
    }

    async updateService(serviceId: string, data: Partial<Service>): Promise<void> {
        const docRef = doc(db, COLLECTIONS.SERVICES, serviceId);
        await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
    }

    async deleteService(serviceId: string): Promise<void> {
        // Soft delete - just mark as inactive
        await this.updateService(serviceId, { isActive: false });
    }

    // ==================== APPOINTMENT OPERATIONS ====================

    async createAppointment(data: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> {
        const id = generateId();
        const appointment: Appointment = {
            ...data,
            id,
            createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, COLLECTIONS.APPOINTMENTS, id), appointment);
        return appointment;
    }

    async getAppointment(appointmentId: string): Promise<Appointment | null> {
        const docRef = doc(db, COLLECTIONS.APPOINTMENTS, appointmentId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? (docSnap.data() as Appointment) : null;
    }

    async getAppointmentsByTenant(tenantId: string, status?: Appointment['status']): Promise<Appointment[]> {
        const constraints: QueryConstraint[] = [
            where('tenantId', '==', tenantId),
            orderBy('date', 'desc'),
            orderBy('time', 'desc')
        ];

        if (status) {
            constraints.push(where('status', '==', status));
        }

        const q = query(collection(db, COLLECTIONS.APPOINTMENTS), ...constraints);
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as Appointment);
    }

    async getAppointmentsByUser(userId: string): Promise<Appointment[]> {
        const q = query(
            collection(db, COLLECTIONS.APPOINTMENTS),
            where('userId', '==', userId),
            orderBy('date', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as Appointment);
    }

    async updateAppointment(appointmentId: string, data: Partial<Appointment>): Promise<void> {
        const docRef = doc(db, COLLECTIONS.APPOINTMENTS, appointmentId);
        await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
    }

    // Real-time listener for appointments (for dashboard)
    subscribeToAppointments(
        tenantId: string,
        callback: (appointments: Appointment[]) => void
    ): () => void {
        const q = query(
            collection(db, COLLECTIONS.APPOINTMENTS),
            where('tenantId', '==', tenantId),
            orderBy('date', 'desc'),
            limit(50)
        );

        return onSnapshot(q, (snapshot) => {
            const appointments = snapshot.docs.map(doc => doc.data() as Appointment);
            callback(appointments);
        });
    }

    // ==================== REVIEW OPERATIONS ====================

    async createReview(data: Omit<Review, 'id'>): Promise<Review> {
        const id = generateId();
        const review: Review = {
            ...data,
            id,
            date: new Date().toISOString(),
            isApproved: false
        };

        await setDoc(doc(db, COLLECTIONS.REVIEWS, id), review);
        return review;
    }

    async getReviews(tenantId: string, approvedOnly: boolean = true): Promise<Review[]> {
        const constraints: QueryConstraint[] = [
            where('tenantId', '==', tenantId),
            orderBy('date', 'desc')
        ];

        if (approvedOnly) {
            constraints.push(where('isApproved', '==', true));
        }

        const q = query(collection(db, COLLECTIONS.REVIEWS), ...constraints);
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as Review);
    }

    async approveReview(reviewId: string): Promise<void> {
        const docRef = doc(db, COLLECTIONS.REVIEWS, reviewId);
        await updateDoc(docRef, { isApproved: true });
    }

    // ==================== BUSINESS SETTINGS ====================

    async saveBusinessSettings(tenantId: string, settings: Omit<BusinessSettings, 'tenantId'>): Promise<void> {
        const docRef = doc(db, COLLECTIONS.SETTINGS, tenantId);
        await setDoc(docRef, { ...settings, tenantId });
    }

    async getBusinessSettings(tenantId: string): Promise<BusinessSettings | null> {
        const docRef = doc(db, COLLECTIONS.SETTINGS, tenantId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? (docSnap.data() as BusinessSettings) : null;
    }

    async updateBusinessSettings(tenantId: string, updates: Partial<BusinessSettings>): Promise<void> {
        const docRef = doc(db, COLLECTIONS.SETTINGS, tenantId);
        await updateDoc(docRef, updates);
    }

    // ==================== ANALYTICS (for dashboard) ====================

    async getTenantStats(tenantId: string): Promise<{
        totalAppointments: number;
        completedAppointments: number;
        totalRevenue: number;
        averageRating: number;
    }> {
        // Get all appointments for this tenant
        const appointmentsQuery = query(
            collection(db, COLLECTIONS.APPOINTMENTS),
            where('tenantId', '==', tenantId)
        );
        const appointmentsSnap = await getDocs(appointmentsQuery);
        const appointments = appointmentsSnap.docs.map(doc => doc.data() as Appointment);

        // Get all reviews for this tenant
        const reviewsQuery = query(
            collection(db, COLLECTIONS.REVIEWS),
            where('tenantId', '==', tenantId),
            where('isApproved', '==', true)
        );
        const reviewsSnap = await getDocs(reviewsQuery);
        const reviews = reviewsSnap.docs.map(doc => doc.data() as Review);

        const totalAppointments = appointments.length;
        const completedAppointments = appointments.filter(a => a.status === 'completed').length;
        const totalRevenue = appointments
            .filter(a => a.paymentStatus === 'paid')
            .reduce((sum, a) => sum + a.totalPrice, 0);
        const averageRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        return {
            totalAppointments,
            completedAppointments,
            totalRevenue,
            averageRating: Math.round(averageRating * 10) / 10
        };
    }

    // ==================== PLATFORM ADMIN (Super Admin) ====================

    async getAllTenants(): Promise<Tenant[]> {
        const q = query(
            collection(db, COLLECTIONS.TENANTS),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as Tenant);
    }

    async getAllUsers(): Promise<User[]> {
        const q = query(
            collection(db, COLLECTIONS.USERS),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as User);
    }

    async getPlatformStats(): Promise<{
        totalTenants: number;
        activeTenants: number;
        totalUsers: number;
        totalRevenue: number;
        planDistribution: Record<string, number>;
    }> {
        // Get all tenants
        const tenantsSnap = await getDocs(collection(db, COLLECTIONS.TENANTS));
        const tenants = tenantsSnap.docs.map(doc => doc.data() as Tenant);

        // Get all users
        const usersSnap = await getDocs(collection(db, COLLECTIONS.USERS));

        // Get all payments for revenue
        const paymentsSnap = await getDocs(collection(db, 'payments'));
        const payments = paymentsSnap.docs.map(doc => doc.data());

        // Calculate stats
        const totalTenants = tenants.length;
        const activeTenants = tenants.filter(t => t.isActive).length;
        const totalUsers = usersSnap.size;
        const totalRevenue = payments
            .filter((p: any) => p.status === 'success')
            .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

        // Plan distribution
        const planDistribution: Record<string, number> = {
            free: 0,
            basic: 0,
            pro: 0,
            enterprise: 0
        };
        tenants.forEach(t => {
            const plan = t.subscriptionPlan || 'free';
            planDistribution[plan] = (planDistribution[plan] || 0) + 1;
        });

        return {
            totalTenants,
            activeTenants,
            totalUsers,
            totalRevenue,
            planDistribution
        };
    }

    async toggleTenantStatus(tenantId: string, isActive: boolean): Promise<void> {
        await this.updateTenant(tenantId, { isActive });
    }
}

export const firestoreService = FirestoreService.getInstance();
export default FirestoreService;

