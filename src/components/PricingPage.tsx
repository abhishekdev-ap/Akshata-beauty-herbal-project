// Pricing Page - Display subscription plans
import React, { useState } from 'react';
import { Check, Star, Zap, Crown, Building2, ArrowLeft } from 'lucide-react';
import { SUBSCRIPTION_PLANS, type SubscriptionPlan } from '../types/subscription';
import { razorpayService } from '../services/razorpayService';
import { useTenant } from '../contexts/TenantContext';

interface PricingPageProps {
    onBack: () => void;
    onSubscriptionComplete?: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onBack, onSubscriptionComplete }) => {
    const { tenant, currentUser, refreshTenant } = useTenant();
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan['id'] | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const getPlanIcon = (planId: SubscriptionPlan['id']) => {
        switch (planId) {
            case 'free': return Star;
            case 'basic': return Zap;
            case 'pro': return Crown;
            case 'enterprise': return Building2;
            default: return Star;
        }
    };

    const getPlanColors = (planId: SubscriptionPlan['id']) => {
        switch (planId) {
            case 'free': return 'from-gray-500 to-gray-600';
            case 'basic': return 'from-blue-500 to-indigo-600';
            case 'pro': return 'from-pink-500 to-purple-600';
            case 'enterprise': return 'from-yellow-500 to-orange-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const handleSubscribe = async (plan: SubscriptionPlan) => {
        if (!tenant || !currentUser) {
            setError('Please log in to subscribe');
            return;
        }

        setIsProcessing(true);
        setError('');
        setSelectedPlan(plan.id);

        try {
            const result = await razorpayService.createSubscription(
                tenant.id,
                plan.id,
                {
                    name: currentUser.name,
                    email: currentUser.email,
                    phone: currentUser.phone
                }
            );

            if (result.success) {
                await refreshTenant();
                onSubscriptionComplete?.();
            } else {
                setError(result.error || 'Subscription failed');
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsProcessing(false);
            setSelectedPlan(null);
        }
    };

    const currentPlan = tenant?.subscriptionPlan || 'free';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
            {/* Header */}
            <header className="bg-gray-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center space-x-4">
                        <button onClick={onBack} className="p-2 text-gray-400 hover:text-white">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Choose Your Plan</h1>
                            <p className="text-gray-400 text-sm">Select the perfect plan for your business</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {error && (
                    <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-center">
                        {error}
                    </div>
                )}

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SUBSCRIPTION_PLANS.map((plan) => {
                        const Icon = getPlanIcon(plan.id);
                        const isCurrentPlan = currentPlan === plan.id;
                        const isPopular = plan.id === 'pro';

                        return (
                            <div
                                key={plan.id}
                                className={`relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border transition-all ${isCurrentPlan
                                        ? 'border-green-500/50 ring-2 ring-green-500/20'
                                        : isPopular
                                            ? 'border-pink-500/50'
                                            : 'border-white/10 hover:border-white/20'
                                    }`}
                            >
                                {isPopular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-medium rounded-full">
                                        Most Popular
                                    </div>
                                )}

                                {isCurrentPlan && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                                        Current Plan
                                    </div>
                                )}

                                {/* Plan Header */}
                                <div className="text-center mb-6">
                                    <div className={`w-14 h-14 bg-gradient-to-r ${getPlanColors(plan.id)} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                    <div className="mt-2">
                                        <span className="text-3xl font-bold text-white">₹{plan.price}</span>
                                        {plan.price > 0 && (
                                            <span className="text-gray-400">/month</span>
                                        )}
                                    </div>
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 mb-6">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start space-x-2">
                                            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-300 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Action Button */}
                                <button
                                    onClick={() => handleSubscribe(plan)}
                                    disabled={isProcessing || isCurrentPlan}
                                    className={`w-full py-3 rounded-xl font-medium transition-all ${isCurrentPlan
                                            ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                                            : isProcessing && selectedPlan === plan.id
                                                ? 'bg-gray-700 text-gray-400 cursor-wait'
                                                : `bg-gradient-to-r ${getPlanColors(plan.id)} text-white hover:opacity-90`
                                        }`}
                                >
                                    {isCurrentPlan
                                        ? 'Current Plan'
                                        : isProcessing && selectedPlan === plan.id
                                            ? 'Processing...'
                                            : plan.price === 0
                                                ? 'Get Started Free'
                                                : 'Upgrade Now'}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* FAQ */}
                <div className="mt-16 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: 'Can I change plans later?', a: 'Yes, you can upgrade or downgrade your plan at any time.' },
                            { q: 'Is there a free trial?', a: 'Our Free plan works like a trial with limited features.' },
                            { q: 'How do payments work?', a: 'We use Razorpay for secure monthly payments.' },
                            { q: 'Can I cancel anytime?', a: 'Yes, cancel anytime with no hidden fees.' }
                        ].map((faq, idx) => (
                            <div key={idx} className="bg-gray-800/30 rounded-xl p-4 border border-white/5">
                                <h4 className="text-white font-medium">{faq.q}</h4>
                                <p className="text-gray-400 text-sm mt-1">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PricingPage;
