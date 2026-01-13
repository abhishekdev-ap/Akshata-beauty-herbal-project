// Business Registration Page - For new salon owners to register their business
import React, { useState } from 'react';
import { Building2, User, Mail, Lock, Phone, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { firebaseAuthService } from '../services/firebaseAuthService';

interface BusinessRegistrationPageProps {
    onRegistrationComplete: () => void;
    onSwitchToLogin: () => void;
}

const BusinessRegistrationPage: React.FC<BusinessRegistrationPageProps> = ({
    onRegistrationComplete,
    onSwitchToLogin
}) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const validateStep1 = (): boolean => {
        if (!formData.businessName.trim()) {
            setError('Business name is required');
            return false;
        }
        if (!formData.ownerName.trim()) {
            setError('Owner name is required');
            return false;
        }
        if (!formData.phone.trim()) {
            setError('Phone number is required');
            return false;
        }
        return true;
    };

    const validateStep2 = (): boolean => {
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!formData.email.includes('@')) {
            setError('Please enter a valid email');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleNextStep = () => {
        if (validateStep1()) {
            setStep(2);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep2()) return;

        setIsLoading(true);
        setError('');

        try {
            await firebaseAuthService.registerBusinessOwner(
                formData.businessName,
                formData.email,
                formData.password,
                formData.ownerName
            );

            onRegistrationComplete();
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl mb-4">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Register Your Business</h1>
                    <p className="text-gray-300">Join our SaaS platform and manage your salon online</p>
                </div>

                {/* Progress indicator */}
                <div className="flex items-center justify-center mb-8">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-pink-500' : 'bg-gray-600'}`}>
                        {step > 1 ? <CheckCircle className="w-5 h-5 text-white" /> : <span className="text-white font-bold">1</span>}
                    </div>
                    <div className={`w-20 h-1 ${step > 1 ? 'bg-pink-500' : 'bg-gray-600'}`} />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-pink-500' : 'bg-gray-600'}`}>
                        <span className="text-white font-bold">2</span>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                    <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNextStep(); }}>
                        {step === 1 ? (
                            <>
                                <h2 className="text-xl font-semibold text-white mb-6">Business Details</h2>

                                {/* Business Name */}
                                <div className="mb-4">
                                    <label className="block text-gray-300 text-sm mb-2">Business Name</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="businessName"
                                            value={formData.businessName}
                                            onChange={handleInputChange}
                                            placeholder="Your Salon Name"
                                            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                </div>

                                {/* Owner Name */}
                                <div className="mb-4">
                                    <label className="block text-gray-300 text-sm mb-2">Owner Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="ownerName"
                                            value={formData.ownerName}
                                            onChange={handleInputChange}
                                            placeholder="Your Full Name"
                                            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="mb-6">
                                    <label className="block text-gray-300 text-sm mb-2">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+91 98765 43210"
                                            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center space-x-2"
                                >
                                    <span>Continue</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold text-white mb-6">Account Setup</h2>

                                {/* Email */}
                                <div className="mb-4">
                                    <label className="block text-gray-300 text-sm mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="your@email.com"
                                            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="mb-4">
                                    <label className="block text-gray-300 text-sm mb-2">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="mb-6">
                                    <label className="block text-gray-300 text-sm mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Sparkles className="w-5 h-5" />
                                                <span>Create Business</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>

                    {/* Login link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <button
                                onClick={onSwitchToLogin}
                                className="text-pink-400 hover:text-pink-300 font-medium"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div className="text-gray-300">
                        <div className="text-2xl mb-1">📅</div>
                        <div className="text-xs">Online Booking</div>
                    </div>
                    <div className="text-gray-300">
                        <div className="text-2xl mb-1">📊</div>
                        <div className="text-xs">Analytics</div>
                    </div>
                    <div className="text-gray-300">
                        <div className="text-2xl mb-1">💳</div>
                        <div className="text-xs">Payments</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessRegistrationPage;
