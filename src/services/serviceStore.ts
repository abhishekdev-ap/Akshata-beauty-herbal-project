import { Service } from '../types';
import { regularServices, packageServices, bridalServices } from '../data/services';

const SERVICES_STORAGE_KEY = 'parlor_services';

export interface ServiceCategory {
    id: string;
    name: string;
    type: 'regular' | 'bridal' | 'package';
}

class ServiceStore {
    private static instance: ServiceStore;

    private constructor() {
        // Initialize with default services if none exist
        if (!this.hasServices()) {
            this.initializeDefaultServices();
        }
    }

    static getInstance(): ServiceStore {
        if (!ServiceStore.instance) {
            ServiceStore.instance = new ServiceStore();
        }
        return ServiceStore.instance;
    }

    private hasServices(): boolean {
        const stored = localStorage.getItem(SERVICES_STORAGE_KEY);
        return stored !== null && JSON.parse(stored).length > 0;
    }

    private initializeDefaultServices(): void {
        const allServices = [...regularServices, ...packageServices, ...bridalServices];
        this.saveServices(allServices);
    }

    private saveServices(services: Service[]): void {
        localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));
    }

    // Get all services
    getServices(): Service[] {
        const stored = localStorage.getItem(SERVICES_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return [];
    }

    // Get services by category
    getServicesByCategory(category: 'regular' | 'bridal'): Service[] {
        return this.getServices().filter(s => s.category === category);
    }

    // Get regular services (individual items)
    getRegularServices(): Service[] {
        return this.getServicesByCategory('regular');
    }

    // Get bridal services
    getBridalServices(): Service[] {
        return this.getServicesByCategory('bridal');
    }

    // Get a single service by ID
    getServiceById(id: string): Service | undefined {
        return this.getServices().find(s => s.id === id);
    }

    // Add a new service
    addService(service: Omit<Service, 'id'>): Service {
        const services = this.getServices();
        const newService: Service = {
            ...service,
            id: `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
        services.push(newService);
        this.saveServices(services);
        return newService;
    }

    // Update an existing service
    updateService(id: string, updates: Partial<Service>): Service | null {
        const services = this.getServices();
        const index = services.findIndex(s => s.id === id);
        if (index === -1) return null;

        const updatedService = { ...services[index], ...updates, id }; // Preserve ID
        services[index] = updatedService;
        this.saveServices(services);
        return updatedService;
    }

    // Delete a service
    deleteService(id: string): boolean {
        const services = this.getServices();
        const filtered = services.filter(s => s.id !== id);
        if (filtered.length === services.length) return false;

        this.saveServices(filtered);
        return true;
    }

    // Clear all services (set to zero)
    clearAllServices(): void {
        localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify([]));
    }

    // Reset to default services
    resetToDefaults(): void {
        this.initializeDefaultServices();
    }

    // Search services
    searchServices(query: string): Service[] {
        const lowerQuery = query.toLowerCase();
        return this.getServices().filter(s =>
            s.name.toLowerCase().includes(lowerQuery) ||
            (s.description && s.description.toLowerCase().includes(lowerQuery))
        );
    }

    // Get service count
    getServiceCount(): { total: number; regular: number; bridal: number } {
        const services = this.getServices();
        return {
            total: services.length,
            regular: services.filter(s => s.category === 'regular').length,
            bridal: services.filter(s => s.category === 'bridal').length
        };
    }
}

export default ServiceStore;
