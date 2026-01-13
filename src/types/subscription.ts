// Subscription Types
export interface SubscriptionPlan {
    id: 'free' | 'basic' | 'pro' | 'enterprise';
    name: string;
    price: number;
    currency: string;
    interval: 'monthly' | 'yearly';
    features: string[];
    limits: {
        bookingsPerMonth: number;
        maxServices: number;
        analytics: boolean;
        customBranding: boolean;
        apiAccess: boolean;
        prioritySupport: boolean;
    };
}

export interface Subscription {
    id: string;
    tenantId: string;
    planId: SubscriptionPlan['id'];
    status: 'active' | 'expired' | 'cancelled' | 'paused';
    startDate: string;
    endDate: string;
    razorpaySubscriptionId?: string;
    razorpayPaymentId?: string;
    amount: number;
    currency: string;
    createdAt: string;
    updatedAt?: string;
}

export interface PaymentRecord {
    id: string;
    tenantId: string;
    subscriptionId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'success' | 'failed' | 'refunded';
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    paymentMethod?: string;
    createdAt: string;
}

// Pricing Plans Data
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'INR',
        interval: 'monthly',
        features: [
            'Up to 10 bookings/month',
            'Up to 5 services',
            'Basic dashboard',
            'Email support'
        ],
        limits: {
            bookingsPerMonth: 10,
            maxServices: 5,
            analytics: false,
            customBranding: false,
            apiAccess: false,
            prioritySupport: false
        }
    },
    {
        id: 'basic',
        name: 'Basic',
        price: 499,
        currency: 'INR',
        interval: 'monthly',
        features: [
            'Up to 100 bookings/month',
            'Up to 20 services',
            'Customer management',
            'Email & chat support'
        ],
        limits: {
            bookingsPerMonth: 100,
            maxServices: 20,
            analytics: false,
            customBranding: false,
            apiAccess: false,
            prioritySupport: false
        }
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 999,
        currency: 'INR',
        interval: 'monthly',
        features: [
            'Unlimited bookings',
            'Unlimited services',
            'Advanced analytics',
            'Priority support',
            'Custom reports'
        ],
        limits: {
            bookingsPerMonth: -1, // -1 = unlimited
            maxServices: -1,
            analytics: true,
            customBranding: false,
            apiAccess: false,
            prioritySupport: true
        }
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 2999,
        currency: 'INR',
        interval: 'monthly',
        features: [
            'Everything in Pro',
            'Custom branding',
            'API access',
            'Dedicated support',
            'Custom integrations',
            'White-label option'
        ],
        limits: {
            bookingsPerMonth: -1,
            maxServices: -1,
            analytics: true,
            customBranding: true,
            apiAccess: true,
            prioritySupport: true
        }
    }
];
