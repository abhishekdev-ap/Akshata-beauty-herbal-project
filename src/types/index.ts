// User roles for SaaS multi-tenancy
export type UserRole = 'superadmin' | 'owner' | 'staff' | 'customer';

// Tenant/Business entity for SaaS
export interface Tenant {
  id: string;
  name: string; // Business/Salon name
  slug: string; // URL-friendly name (e.g., "akshata-beauty")
  ownerId: string; // User ID of owner
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
  subscriptionPlan?: 'free' | 'basic' | 'pro' | 'enterprise';
  subscriptionStatus?: 'active' | 'expired' | 'cancelled';
  subscriptionEndDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  lastLogin?: string;
  role?: UserRole; // Optional for backward compatibility
  tenantId?: string; // Which business this user belongs to (for owners, staff)
  phone?: string;
}

export interface Service {
  id: string;
  tenantId: string; // Which business owns this service
  name: string;
  price: number;
  duration: number; // in minutes
  category: 'regular' | 'bridal';
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Appointment {
  id: string;
  tenantId: string; // Which business this appointment belongs to
  userId: string;
  customerName?: string;
  customerEmail?: string;
  services: Service[];
  date: string;
  time: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  serviceLocation: 'parlor' | 'home';
  customerAddress?: string;
  customerPhone?: string;
  notes?: string;
  paymentMethod?: 'upi' | 'card' | 'cash';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentId?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentHistory {
  id: string;
  tenantId: string;
  appointmentId: string;
  userId: string;
  amount: number;
  paymentMethod: 'upi' | 'card' | 'cash';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentId?: string;
  transactionDate: string;
  services: Service[];
  customerName: string;
  customerEmail: string;
  notes?: string;
}

export interface Review {
  id: string;
  tenantId: string;
  userId: string;
  appointmentId: string;
  rating: number;
  comment: string;
  date: string;
  customerName?: string;
  customerAvatar?: string;
  services?: string[];
  isEdited?: boolean;
  editedAt?: string;
  isApproved?: boolean; // Owner can approve reviews to display
}

// Business Settings (per tenant)
export interface BusinessSettings {
  tenantId: string;
  parlorName: string;
  ownerName: string;
  contactNumber: string;
  whatsappNumber?: string;
  email?: string;
  address: string;
  city: string;
  homeServiceEnabled: boolean;
  homeServiceExtraCharge: number;
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: string[];
  logoUrl?: string;
  tagline?: string;
  emailNotificationEnabled: boolean;
  web3FormsAccessKey?: string;
  theme?: {
    primaryColor: string;
    secondaryColor: string;
  };
}