// Super Admin Dashboard - Platform-wide admin panel
import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Building2, Users, DollarSign, TrendingUp,
    BarChart3, Crown, Shield, Settings
} from 'lucide-react';
import { firestoreService } from '../services/firestoreService';
import type { Tenant } from '../types';

interface SuperAdminDashboardProps {
    onBack: () => void;
    onManageTenants: () => void;
}

interface PlatformStats {
    totalTenants: number;
    activeTenants: number;
    totalUsers: number;
    totalRevenue: number;
    planDistribution: Record<string, number>;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onBack, onManageTenants }) => {
    const [stats, setStats] = useState<PlatformStats | null>(null);
    const [recentTenants, setRecentTenants] = useState<Tenant[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [platformStats, tenants] = await Promise.all([
                firestoreService.getPlatformStats(),
                firestoreService.getAllTenants()
            ]);
            setStats(platformStats);
            setRecentTenants(tenants.slice(0, 5));
        } catch (error) {
            console.error('Error loading platform data:', error);
        }
        setIsLoading(false);
    };

    const statCards = stats ? [
        { label: 'Total Salons', value: stats.totalTenants, icon: Building2, color: 'from-pink-500 to-rose-600' },
        { label: 'Active Salons', value: stats.activeTenants, icon: TrendingUp, color: 'from-green-500 to-emerald-600' },
        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-indigo-600' },
        { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'from-yellow-500 to-orange-600' }
    ] : [];

    const getPlanColor = (plan: string) => {
        switch (plan) {
            case 'free': return 'bg-gray-500';
            case 'basic': return 'bg-blue-500';
            case 'pro': return 'bg-purple-500';
            case 'enterprise': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button onClick={onBack} className="p-2 text-gray-400 hover:text-white">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Super Admin</h1>
                                    <p className="text-gray-400 text-sm">Platform Management</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, idx) => (
                        <div key={idx} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm">{stat.label}</p>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Plan Distribution */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                                <BarChart3 className="w-5 h-5 text-pink-400" />
                                <span>Plan Distribution</span>
                            </h3>
                        </div>
                        {stats && (
                            <div className="space-y-4">
                                {Object.entries(stats.planDistribution).map(([plan, count]) => (
                                    <div key={plan} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-3 h-3 rounded-full ${getPlanColor(plan)}`} />
                                            <span className="text-white capitalize">{plan}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-32 bg-gray-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${getPlanColor(plan)}`}
                                                    style={{ width: `${stats.totalTenants ? (count / stats.totalTenants) * 100 : 0}%` }}
                                                />
                                            </div>
                                            <span className="text-gray-400 w-8 text-right">{count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Signups */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                                <Building2 className="w-5 h-5 text-blue-400" />
                                <span>Recent Salons</span>
                            </h3>
                            <button
                                onClick={onManageTenants}
                                className="text-pink-400 hover:text-pink-300 text-sm"
                            >
                                View All →
                            </button>
                        </div>
                        {recentTenants.length === 0 ? (
                            <div className="text-center py-8">
                                <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-400">No salons registered yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentTenants.map((tenant) => (
                                    <div key={tenant.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                {tenant.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{tenant.name}</p>
                                                <p className="text-gray-400 text-sm">
                                                    {new Date(tenant.createdAt).toLocaleDateString('en-IN')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${tenant.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {tenant.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                            <Crown className={`w-4 h-4 ${tenant.subscriptionPlan === 'pro' || tenant.subscriptionPlan === 'enterprise'
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-500'
                                                }`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                            onClick={onManageTenants}
                            className="bg-gray-800/50 rounded-xl p-4 border border-white/10 hover:border-white/20 text-left transition-all"
                        >
                            <Building2 className="w-8 h-8 text-pink-400 mb-2" />
                            <p className="text-white font-medium">Manage Salons</p>
                            <p className="text-gray-400 text-sm">View all registered salons</p>
                        </button>
                        <button className="bg-gray-800/50 rounded-xl p-4 border border-white/10 hover:border-white/20 text-left transition-all opacity-50">
                            <Users className="w-8 h-8 text-blue-400 mb-2" />
                            <p className="text-white font-medium">Manage Users</p>
                            <p className="text-gray-400 text-sm">Coming soon</p>
                        </button>
                        <button className="bg-gray-800/50 rounded-xl p-4 border border-white/10 hover:border-white/20 text-left transition-all opacity-50">
                            <Settings className="w-8 h-8 text-purple-400 mb-2" />
                            <p className="text-white font-medium">Settings</p>
                            <p className="text-gray-400 text-sm">Coming soon</p>
                        </button>
                        <button className="bg-gray-800/50 rounded-xl p-4 border border-white/10 hover:border-white/20 text-left transition-all opacity-50">
                            <BarChart3 className="w-8 h-8 text-green-400 mb-2" />
                            <p className="text-white font-medium">Reports</p>
                            <p className="text-gray-400 text-sm">Coming soon</p>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SuperAdminDashboard;
