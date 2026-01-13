// Owner Dashboard Page - Main dashboard for salon owners
import React, { useState, useEffect } from 'react';
import {
    Calendar, Users, DollarSign, Star, TrendingUp, Settings,
    Scissors, Clock, ArrowRight, Plus, Bell, BarChart3
} from 'lucide-react';
import { useTenant } from '../contexts/TenantContext';
import { firestoreService } from '../services/firestoreService';

interface OwnerDashboardPageProps {
    onNavigate: (page: string) => void;
}

interface DashboardStats {
    totalAppointments: number;
    completedAppointments: number;
    totalRevenue: number;
    averageRating: number;
}

const OwnerDashboardPage: React.FC<OwnerDashboardPageProps> = ({ onNavigate }) => {
    const { tenant, settings, currentUser } = useTenant();
    const [stats, setStats] = useState<DashboardStats>({
        totalAppointments: 0,
        completedAppointments: 0,
        totalRevenue: 0,
        averageRating: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            if (tenant?.id) {
                try {
                    const tenantStats = await firestoreService.getTenantStats(tenant.id);
                    setStats(tenantStats);
                } catch (error) {
                    console.error('Error loading stats:', error);
                }
            }
            setIsLoading(false);
        };

        loadStats();
    }, [tenant?.id]);

    const quickActions = [
        { icon: Plus, label: 'Add Service', action: () => onNavigate('services'), color: 'from-pink-500 to-rose-500' },
        { icon: Calendar, label: 'View Bookings', action: () => onNavigate('appointments'), color: 'from-purple-500 to-indigo-500' },
        { icon: Users, label: 'Customers', action: () => onNavigate('customers'), color: 'from-blue-500 to-cyan-500' },
        { icon: DollarSign, label: 'Subscription', action: () => onNavigate('subscription'), color: 'from-green-500 to-emerald-500' }
    ];

    const sidebarLinks = [
        { icon: Scissors, label: 'Services', action: () => onNavigate('services') },
        { icon: Calendar, label: 'Appointments', action: () => onNavigate('appointments') },
        { icon: Users, label: 'Customers', action: () => onNavigate('customers') },
        { icon: BarChart3, label: 'Analytics', action: () => onNavigate('analytics') },
        { icon: DollarSign, label: 'Pricing & Plans', action: () => onNavigate('pricing') },
        { icon: Settings, label: 'Settings', action: () => onNavigate('settings') },
    ];

    // Check if user is superadmin (for platform admin access)
    const isSuperAdmin = currentUser?.role === 'superadmin';

    const statCards = [
        {
            label: 'Total Appointments',
            value: stats.totalAppointments,
            icon: Calendar,
            color: 'bg-gradient-to-br from-pink-500 to-rose-600',
            change: '+12%'
        },
        {
            label: 'Completed',
            value: stats.completedAppointments,
            icon: Users,
            color: 'bg-gradient-to-br from-purple-500 to-indigo-600',
            change: '+8%'
        },
        {
            label: 'Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'bg-gradient-to-br from-green-500 to-emerald-600',
            change: '+23%'
        },
        {
            label: 'Average Rating',
            value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A',
            icon: Star,
            color: 'bg-gradient-to-br from-yellow-500 to-orange-600',
            change: '⭐'
        }
    ];

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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                {settings?.parlorName || tenant?.name || 'Dashboard'}
                            </h1>
                            <p className="text-gray-400 text-sm">Welcome back, {currentUser?.name || 'Owner'}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
                            </button>
                            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                {currentUser?.name?.charAt(0) || 'O'}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl p-6 mb-8 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">🎉 Your salon is live!</h2>
                            <p className="text-gray-300">Start adding services and accepting bookings from customers.</p>
                        </div>
                        <button
                            onClick={() => onNavigate('services')}
                            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center space-x-2"
                        >
                            <Scissors className="w-5 h-5" />
                            <span>Add Services</span>
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={action.action}
                                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all group"
                            >
                                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <action.icon className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-white font-medium">{action.label}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Activity & Tips */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Appointments */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">Recent Appointments</h3>
                            <button
                                onClick={() => onNavigate('appointments')}
                                className="text-pink-400 hover:text-pink-300 text-sm flex items-center space-x-1"
                            >
                                <span>View All</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {stats.totalAppointments === 0 ? (
                            <div className="text-center py-8">
                                <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-400">No appointments yet</p>
                                <p className="text-gray-500 text-sm">Appointments will appear here once customers book</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-gray-400">Recent bookings will appear here</p>
                            </div>
                        )}
                    </div>

                    {/* Getting Started Tips */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-6">Getting Started</h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-pink-400 font-bold">1</span>
                                </div>
                                <div>
                                    <p className="text-white font-medium">Add your services</p>
                                    <p className="text-gray-400 text-sm">List all the beauty services you offer with prices</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-purple-400 font-bold">2</span>
                                </div>
                                <div>
                                    <p className="text-white font-medium">Set your business hours</p>
                                    <p className="text-gray-400 text-sm">Configure when customers can book appointments</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-400 font-bold">3</span>
                                </div>
                                <div>
                                    <p className="text-white font-medium">Share your booking link</p>
                                    <p className="text-gray-400 text-sm">Send your salon's link to customers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OwnerDashboardPage;
