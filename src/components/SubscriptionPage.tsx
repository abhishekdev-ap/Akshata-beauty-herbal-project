// Subscription Management Page
import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, CreditCard, Calendar, CheckCircle, AlertCircle,
    RefreshCw, Crown, Download
} from 'lucide-react';
import { useTenant } from '../contexts/TenantContext';
import { razorpayService } from '../services/razorpayService';
import type { Subscription, PaymentRecord, SubscriptionPlan } from '../types/subscription';
import { SUBSCRIPTION_PLANS } from '../types/subscription';

interface SubscriptionPageProps {
    onBack: () => void;
    onUpgrade: () => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ onBack, onUpgrade }) => {
    const { tenant } = useTenant();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    useEffect(() => {
        loadData();
    }, [tenant?.id]);

    const loadData = async () => {
        if (!tenant?.id) return;
        setIsLoading(true);
        try {
            const [sub, pay] = await Promise.all([
                razorpayService.getCurrentSubscription(tenant.id),
                razorpayService.getPaymentHistory(tenant.id)
            ]);
            setSubscription(sub);
            setPayments(pay);
        } catch (error) {
            console.error('Error loading subscription:', error);
        }
        setIsLoading(false);
    };

    const handleCancel = async () => {
        if (!subscription) return;
        try {
            await razorpayService.cancelSubscription(subscription.id);
            await loadData();
            setShowCancelConfirm(false);
        } catch (error) {
            console.error('Error cancelling subscription:', error);
        }
    };

    const currentPlan = SUBSCRIPTION_PLANS.find(p => p.id === (tenant?.subscriptionPlan || 'free'));
    const isFreePlan = currentPlan?.id === 'free';

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
            {/* Header */}
            <header className="bg-gray-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center space-x-4">
                        <button onClick={onBack} className="p-2 text-gray-400 hover:text-white">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Subscription & Billing</h1>
                            <p className="text-gray-400 text-sm">Manage your subscription</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Current Plan Card */}
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-white/10 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isFreePlan ? 'bg-gray-600' : 'bg-gradient-to-r from-pink-500 to-purple-600'
                                }`}>
                                <Crown className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{currentPlan?.name} Plan</h2>
                                <p className="text-gray-400">
                                    {isFreePlan ? 'Free forever' : `₹${currentPlan?.price}/month`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${subscription?.status === 'active' || isFreePlan
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                {subscription?.status === 'active' || isFreePlan ? 'Active' : subscription?.status || 'Free'}
                            </span>
                        </div>
                    </div>

                    {/* Plan Features */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                            <p className="text-gray-400 text-sm">Bookings/mo</p>
                            <p className="text-white font-bold">
                                {currentPlan?.limits.bookingsPerMonth === -1 ? 'Unlimited' : currentPlan?.limits.bookingsPerMonth}
                            </p>
                        </div>
                        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                            <p className="text-gray-400 text-sm">Services</p>
                            <p className="text-white font-bold">
                                {currentPlan?.limits.maxServices === -1 ? 'Unlimited' : currentPlan?.limits.maxServices}
                            </p>
                        </div>
                        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                            <p className="text-gray-400 text-sm">Analytics</p>
                            <p className="text-white font-bold">{currentPlan?.limits.analytics ? '✓' : '✗'}</p>
                        </div>
                        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                            <p className="text-gray-400 text-sm">Priority Support</p>
                            <p className="text-white font-bold">{currentPlan?.limits.prioritySupport ? '✓' : '✗'}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={onUpgrade}
                            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90"
                        >
                            {isFreePlan ? 'Upgrade Plan' : 'Change Plan'}
                        </button>
                        {!isFreePlan && subscription?.status === 'active' && (
                            <button
                                onClick={() => setShowCancelConfirm(true)}
                                className="px-6 py-3 bg-red-500/20 text-red-400 rounded-xl font-medium hover:bg-red-500/30"
                            >
                                Cancel Subscription
                            </button>
                        )}
                    </div>

                    {/* Next billing */}
                    {!isFreePlan && subscription && (
                        <div className="mt-6 pt-6 border-t border-white/10 flex items-center space-x-2 text-gray-400">
                            <Calendar className="w-5 h-5" />
                            <span>Next billing date: {formatDate(subscription.endDate)}</span>
                        </div>
                    )}
                </div>

                {/* Payment History */}
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4">Payment History</h3>

                    {payments.length === 0 ? (
                        <div className="text-center py-8">
                            <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">No payment history yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {payments.map((payment) => (
                                <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${payment.status === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
                                            }`}>
                                            {payment.status === 'success' ? (
                                                <CheckCircle className="w-5 h-5 text-green-400" />
                                            ) : (
                                                <AlertCircle className="w-5 h-5 text-red-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">₹{payment.amount}</p>
                                            <p className="text-gray-400 text-sm">{formatDate(payment.createdAt)}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${payment.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {payment.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Cancel Confirmation Modal */}
            {showCancelConfirm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-2xl w-full max-w-md p-6 border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-4">Cancel Subscription?</h3>
                        <p className="text-gray-400 mb-6">
                            Your subscription will remain active until the end of your billing period. After that, you'll be downgraded to the Free plan.
                        </p>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setShowCancelConfirm(false)}
                                className="flex-1 py-3 bg-gray-700 text-white rounded-xl"
                            >
                                Keep Plan
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex-1 py-3 bg-red-500 text-white rounded-xl"
                            >
                                Cancel Subscription
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionPage;
