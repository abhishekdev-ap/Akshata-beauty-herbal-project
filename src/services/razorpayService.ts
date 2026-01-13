// Razorpay Service - Handle subscription payments
// Note: For production, webhook handling should be done on server-side

import { doc, setDoc, updateDoc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Subscription, PaymentRecord, SubscriptionPlan } from '../types/subscription';
import { SUBSCRIPTION_PLANS } from '../types/subscription';

// Razorpay configuration
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

// Generate unique ID
const generateId = (): string => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

declare global {
    interface Window {
        Razorpay: any;
    }
}

class RazorpayService {
    private static instance: RazorpayService;

    static getInstance(): RazorpayService {
        if (!RazorpayService.instance) {
            RazorpayService.instance = new RazorpayService();
        }
        return RazorpayService.instance;
    }

    // Check if Razorpay is configured
    isConfigured(): boolean {
        return !!RAZORPAY_KEY_ID;
    }

    // Get plan by ID
    getPlan(planId: SubscriptionPlan['id']): SubscriptionPlan | undefined {
        return SUBSCRIPTION_PLANS.find(p => p.id === planId);
    }

    // Get all plans
    getAllPlans(): SubscriptionPlan[] {
        return SUBSCRIPTION_PLANS;
    }

    // Load Razorpay script
    private loadRazorpayScript(): Promise<boolean> {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }

    // Create subscription checkout
    async createSubscription(
        tenantId: string,
        planId: SubscriptionPlan['id'],
        customerInfo: { name: string; email: string; phone?: string }
    ): Promise<{ success: boolean; subscription?: Subscription; error?: string }> {
        const plan = this.getPlan(planId);
        if (!plan) {
            return { success: false, error: 'Invalid plan selected' };
        }

        // Free plan - just create subscription directly
        if (plan.price === 0) {
            const subscription = await this.createFreeSubscription(tenantId, plan);
            return { success: true, subscription };
        }

        // Load Razorpay if not already loaded
        const loaded = await this.loadRazorpayScript();
        if (!loaded) {
            return { success: false, error: 'Failed to load payment gateway' };
        }

        // Check if Razorpay key is configured
        if (!this.isConfigured()) {
            // Mock mode - simulate successful payment for development
            console.log('Razorpay not configured - using mock mode');
            const subscription = await this.createMockSubscription(tenantId, plan);
            return { success: true, subscription };
        }

        // Create Razorpay order (in production, this should be done server-side)
        return new Promise((resolve) => {
            const options = {
                key: RAZORPAY_KEY_ID,
                amount: plan.price * 100, // Amount in paise
                currency: plan.currency,
                name: 'Beauty SaaS Platform',
                description: `${plan.name} Plan - Monthly Subscription`,
                prefill: {
                    name: customerInfo.name,
                    email: customerInfo.email,
                    contact: customerInfo.phone || ''
                },
                theme: {
                    color: '#ec4899' // Pink color
                },
                handler: async (response: any) => {
                    // Payment successful
                    const subscription = await this.saveSubscription(tenantId, plan, {
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id
                    });
                    resolve({ success: true, subscription });
                },
                modal: {
                    ondismiss: () => {
                        resolve({ success: false, error: 'Payment cancelled by user' });
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        });
    }

    // Create free subscription
    private async createFreeSubscription(tenantId: string, plan: SubscriptionPlan): Promise<Subscription> {
        const now = new Date();
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 100); // Free plan never expires

        const subscription: Subscription = {
            id: generateId(),
            tenantId,
            planId: plan.id,
            status: 'active',
            startDate: now.toISOString(),
            endDate: endDate.toISOString(),
            amount: 0,
            currency: plan.currency,
            createdAt: now.toISOString()
        };

        await setDoc(doc(db, 'subscriptions', subscription.id), subscription);
        await this.updateTenantSubscription(tenantId, plan.id);
        return subscription;
    }

    // Create mock subscription for development
    private async createMockSubscription(tenantId: string, plan: SubscriptionPlan): Promise<Subscription> {
        const now = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        const subscription: Subscription = {
            id: generateId(),
            tenantId,
            planId: plan.id,
            status: 'active',
            startDate: now.toISOString(),
            endDate: endDate.toISOString(),
            razorpayPaymentId: `mock_${generateId()}`,
            amount: plan.price,
            currency: plan.currency,
            createdAt: now.toISOString()
        };

        await setDoc(doc(db, 'subscriptions', subscription.id), subscription);
        await this.updateTenantSubscription(tenantId, plan.id);

        // Create payment record
        await this.savePaymentRecord(tenantId, subscription.id, plan.price, plan.currency, 'success', subscription.razorpayPaymentId);

        return subscription;
    }

    // Save subscription after payment
    private async saveSubscription(
        tenantId: string,
        plan: SubscriptionPlan,
        paymentInfo: { razorpayPaymentId?: string; razorpayOrderId?: string }
    ): Promise<Subscription> {
        const now = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        const subscription: Subscription = {
            id: generateId(),
            tenantId,
            planId: plan.id,
            status: 'active',
            startDate: now.toISOString(),
            endDate: endDate.toISOString(),
            razorpayPaymentId: paymentInfo.razorpayPaymentId,
            amount: plan.price,
            currency: plan.currency,
            createdAt: now.toISOString()
        };

        await setDoc(doc(db, 'subscriptions', subscription.id), subscription);
        await this.updateTenantSubscription(tenantId, plan.id);

        // Create payment record
        await this.savePaymentRecord(
            tenantId,
            subscription.id,
            plan.price,
            plan.currency,
            'success',
            paymentInfo.razorpayPaymentId
        );

        return subscription;
    }

    // Update tenant's subscription info
    private async updateTenantSubscription(tenantId: string, planId: SubscriptionPlan['id']): Promise<void> {
        const tenantRef = doc(db, 'tenants', tenantId);
        await updateDoc(tenantRef, {
            subscriptionPlan: planId,
            subscriptionStatus: 'active',
            updatedAt: new Date().toISOString()
        });
    }

    // Save payment record
    private async savePaymentRecord(
        tenantId: string,
        subscriptionId: string,
        amount: number,
        currency: string,
        status: PaymentRecord['status'],
        razorpayPaymentId?: string
    ): Promise<void> {
        const record: PaymentRecord = {
            id: generateId(),
            tenantId,
            subscriptionId,
            amount,
            currency,
            status,
            razorpayPaymentId,
            createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'payments', record.id), record);
    }

    // Get current subscription for tenant
    async getCurrentSubscription(tenantId: string): Promise<Subscription | null> {
        const q = query(
            collection(db, 'subscriptions'),
            where('tenantId', '==', tenantId),
            where('status', '==', 'active'),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.empty ? null : (snapshot.docs[0].data() as Subscription);
    }

    // Get payment history for tenant
    async getPaymentHistory(tenantId: string): Promise<PaymentRecord[]> {
        const q = query(
            collection(db, 'payments'),
            where('tenantId', '==', tenantId),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as PaymentRecord);
    }

    // Cancel subscription
    async cancelSubscription(subscriptionId: string): Promise<void> {
        const subRef = doc(db, 'subscriptions', subscriptionId);
        await updateDoc(subRef, {
            status: 'cancelled',
            updatedAt: new Date().toISOString()
        });
    }
}

export const razorpayService = RazorpayService.getInstance();
export default RazorpayService;
