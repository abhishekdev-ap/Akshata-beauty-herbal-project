// Tenant Context - Provides current tenant/business data throughout the app
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { firestoreService } from '../services/firestoreService';
import { firebaseAuthService } from '../services/firebaseAuthService';
import type { Tenant, BusinessSettings, User } from '../types';

interface TenantContextType {
    tenant: Tenant | null;
    settings: BusinessSettings | null;
    currentUser: User | null;
    isLoading: boolean;
    isOwner: boolean;
    setTenant: (tenant: Tenant | null) => void;
    refreshTenant: () => Promise<void>;
    refreshSettings: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = (): TenantContextType => {
    const context = useContext(TenantContext);
    if (!context) {
        throw new Error('useTenant must be used within a TenantProvider');
    }
    return context;
};

interface TenantProviderProps {
    children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [settings, setSettings] = useState<BusinessSettings | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if current user is the owner of this tenant
    const isOwner = currentUser?.role === 'owner' && currentUser?.tenantId === tenant?.id;

    // Load tenant and settings
    const loadTenantData = async (tenantId: string) => {
        try {
            const [tenantData, settingsData] = await Promise.all([
                firestoreService.getTenant(tenantId),
                firestoreService.getBusinessSettings(tenantId)
            ]);
            setTenant(tenantData);
            setSettings(settingsData);
        } catch (error) {
            console.error('Error loading tenant data:', error);
        }
    };

    // Refresh tenant data
    const refreshTenant = async () => {
        if (tenant?.id) {
            const tenantData = await firestoreService.getTenant(tenant.id);
            setTenant(tenantData);
        }
    };

    // Refresh settings
    const refreshSettings = async () => {
        if (tenant?.id) {
            const settingsData = await firestoreService.getBusinessSettings(tenant.id);
            setSettings(settingsData);
        }
    };

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = firebaseAuthService.onAuthStateChange(async (user) => {
            setCurrentUser(user);

            if (user?.tenantId) {
                // User belongs to a tenant - load that tenant's data
                await loadTenantData(user.tenantId);
            } else if (user?.role === 'owner') {
                // Owner without tenantId - try to find their tenant
                const ownerTenant = await firestoreService.getTenantByOwnerId(user.id);
                if (ownerTenant) {
                    await loadTenantData(ownerTenant.id);
                }
            }

            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Also check URL for tenant slug (for public pages)
    useEffect(() => {
        const checkUrlForTenant = async () => {
            const pathParts = window.location.pathname.split('/');
            const potentialSlug = pathParts[1];

            // Skip if it's a known route
            const knownRoutes = ['', 'login', 'register', 'register-business', 'owner', 'admin'];
            if (knownRoutes.includes(potentialSlug)) {
                setIsLoading(false);
                return;
            }

            // Try to find tenant by slug
            const tenantBySlug = await firestoreService.getTenantBySlug(potentialSlug);
            if (tenantBySlug) {
                await loadTenantData(tenantBySlug.id);
            }

            setIsLoading(false);
        };

        if (!currentUser) {
            checkUrlForTenant();
        }
    }, [currentUser]);

    const value: TenantContextType = {
        tenant,
        settings,
        currentUser,
        isLoading,
        isOwner,
        setTenant,
        refreshTenant,
        refreshSettings
    };

    return (
        <TenantContext.Provider value={value}>
            {children}
        </TenantContext.Provider>
    );
};

export default TenantContext;
