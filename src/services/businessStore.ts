const BUSINESS_STORAGE_KEY = 'parlor_business_settings';

export interface BusinessSettings {
    parlorName: string;
    ownerName: string;
    contactNumber: string;
    whatsappNumber?: string;
    email?: string;
    address: string;
    city: string;
    homeServiceEnabled: boolean;
    homeServiceExtraCharge: number; // Extra charge for home visits
    workingHours: {
        start: string; // e.g., "09:00"
        end: string;   // e.g., "18:00"
    };
    workingDays: string[]; // e.g., ["Monday", "Tuesday", ...]
    logoUrl?: string;
    tagline?: string;
    // Email Settings
    emailNotificationEnabled: boolean;
    web3FormsAccessKey?: string;
}

const DEFAULT_SETTINGS: BusinessSettings = {
    parlorName: 'AKSHATA BEAUTY HERBAL PARLOUR',
    ownerName: 'Akshata',
    contactNumber: '+919740303404',
    whatsappNumber: '+919740303404',
    email: '',
    address: '',
    city: '',
    homeServiceEnabled: true,
    homeServiceExtraCharge: 100,
    workingHours: {
        start: '09:00',
        end: '18:00'
    },
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    tagline: 'Beauty & Bridal Services',
    emailNotificationEnabled: true,
    web3FormsAccessKey: ''
};

class BusinessStore {
    private static instance: BusinessStore;

    private constructor() {
        // Initialize with default settings if none exist
        if (!this.hasSettings()) {
            this.saveSettings(DEFAULT_SETTINGS);
        }
    }

    static getInstance(): BusinessStore {
        if (!BusinessStore.instance) {
            BusinessStore.instance = new BusinessStore();
        }
        return BusinessStore.instance;
    }

    private hasSettings(): boolean {
        return localStorage.getItem(BUSINESS_STORAGE_KEY) !== null;
    }

    private saveSettings(settings: BusinessSettings): void {
        localStorage.setItem(BUSINESS_STORAGE_KEY, JSON.stringify(settings));
    }

    // Get all business settings
    getSettings(): BusinessSettings {
        const stored = localStorage.getItem(BUSINESS_STORAGE_KEY);
        if (stored) {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
        }
        return DEFAULT_SETTINGS;
    }

    // Update business settings
    updateSettings(updates: Partial<BusinessSettings>): BusinessSettings {
        const current = this.getSettings();
        const updated = { ...current, ...updates };
        this.saveSettings(updated);
        return updated;
    }

    // Get parlor name
    getParlorName(): string {
        return this.getSettings().parlorName;
    }

    // Get contact number
    getContactNumber(): string {
        return this.getSettings().contactNumber;
    }

    // Check if home service is enabled
    isHomeServiceEnabled(): boolean {
        return this.getSettings().homeServiceEnabled;
    }

    // Get home service extra charge
    getHomeServiceCharge(): number {
        return this.getSettings().homeServiceExtraCharge;
    }

    // Get working hours
    getWorkingHours(): { start: string; end: string } {
        return this.getSettings().workingHours;
    }

    // Get available time slots based on working hours
    getTimeSlots(): string[] {
        const { start, end } = this.getWorkingHours();
        const slots: string[] = [];

        const startHour = parseInt(start.split(':')[0]);
        const endHour = parseInt(end.split(':')[0]);

        for (let hour = startHour; hour < endHour; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
        }

        return slots;
    }

    // Reset to default settings
    resetToDefaults(): void {
        this.saveSettings(DEFAULT_SETTINGS);
    }
}

export default BusinessStore;
