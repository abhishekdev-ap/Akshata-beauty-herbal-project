// Tenant Management Page - Manage all salons/tenants
import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Search, Building2, Crown, Calendar,
    Check, X, ExternalLink, Mail, Phone
} from 'lucide-react';
import { firestoreService } from '../services/firestoreService';
import type { Tenant, BusinessSettings } from '../types';

interface TenantManagementPageProps {
    onBack: () => void;
}

const TenantManagementPage: React.FC<TenantManagementPageProps> = ({ onBack }) => {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [tenantSettings, setTenantSettings] = useState<BusinessSettings | null>(null);
    const [filterPlan, setFilterPlan] = useState<string>('all');

    useEffect(() => {
        loadTenants();
    }, []);

    const loadTenants = async () => {
        setIsLoading(true);
        try {
            const data = await firestoreService.getAllTenants();
            setTenants(data);
        } catch (error) {
            console.error('Error loading tenants:', error);
        }
        setIsLoading(false);
    };

    const handleViewTenant = async (tenant: Tenant) => {
        setSelectedTenant(tenant);
        try {
            const settings = await firestoreService.getBusinessSettings(tenant.id);
            setTenantSettings(settings);
        } catch (error) {
            console.error('Error loading tenant settings:', error);
        }
    };

    const handleToggleStatus = async (tenant: Tenant) => {
        try {
            await firestoreService.toggleTenantStatus(tenant.id, !tenant.isActive);
            await loadTenants();
            if (selectedTenant?.id === tenant.id) {
                setSelectedTenant({ ...tenant, isActive: !tenant.isActive });
            }
        } catch (error) {
            console.error('Error toggling tenant status:', error);
        }
    };

    const getPlanBadge = (plan: string) => {
        const colors: Record<string, string> = {
            free: 'bg-gray-500/20 text-gray-400',
            basic: 'bg-blue-500/20 text-blue-400',
            pro: 'bg-purple-500/20 text-purple-400',
            enterprise: 'bg-yellow-500/20 text-yellow-400'
        };
        return colors[plan] || colors.free;
    };

    const filteredTenants = tenants.filter(tenant => {
        const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.slug.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPlan = filterPlan === 'all' || tenant.subscriptionPlan === filterPlan;
        return matchesSearch && matchesPlan;
    });

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
            <header className="bg-gray-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center space-x-4">
                        <button onClick={onBack} className="p-2 text-gray-400 hover:text-white">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Tenant Management</h1>
                            <p className="text-gray-400 text-sm">{tenants.length} registered salons</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search salons..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                        />
                    </div>
                    <select
                        value={filterPlan}
                        onChange={(e) => setFilterPlan(e.target.value)}
                        className="px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500"
                    >
                        <option value="all">All Plans</option>
                        <option value="free">Free</option>
                        <option value="basic">Basic</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                    </select>
                </div>

                {/* Tenants List */}
                {filteredTenants.length === 0 ? (
                    <div className="text-center py-16">
                        <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No salons found</h3>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredTenants.map((tenant) => (
                            <div
                                key={tenant.id}
                                className="bg-gray-800/50 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                            {tenant.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <h3 className="text-white font-medium">{tenant.name}</h3>
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPlanBadge(tenant.subscriptionPlan || 'free')}`}>
                                                    {tenant.subscriptionPlan || 'free'}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                                                <span className="flex items-center space-x-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(tenant.createdAt).toLocaleDateString('en-IN')}</span>
                                                </span>
                                                <span>/{tenant.slug}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${tenant.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {tenant.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                        <button
                                            onClick={() => handleViewTenant(tenant)}
                                            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleToggleStatus(tenant)}
                                            className={`p-2 rounded-lg ${tenant.isActive
                                                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                }`}
                                        >
                                            {tenant.isActive ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Tenant Detail Sidebar */}
            {selectedTenant && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end">
                    <div className="w-full max-w-md bg-gray-900 h-full overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">Salon Details</h2>
                                <button
                                    onClick={() => { setSelectedTenant(null); setTenantSettings(null); }}
                                    className="text-gray-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Tenant Info */}
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                    {selectedTenant.name.charAt(0)}
                                </div>
                                <h3 className="text-xl font-semibold text-white">{selectedTenant.name}</h3>
                                <p className="text-gray-400">/{selectedTenant.slug}</p>
                            </div>

                            {/* Status & Plan */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                                    <p className="text-gray-400 text-sm mb-1">Status</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedTenant.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {selectedTenant.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                                    <p className="text-gray-400 text-sm mb-1">Plan</p>
                                    <div className="flex items-center justify-center space-x-1">
                                        <Crown className="w-4 h-4 text-yellow-400" />
                                        <span className="text-white capitalize">{selectedTenant.subscriptionPlan || 'Free'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Business Settings */}
                            {tenantSettings && (
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-white">Business Info</h4>
                                    <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <Building2 className="w-5 h-5 text-gray-400" />
                                            <span className="text-white">{tenantSettings.parlorName}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Phone className="w-5 h-5 text-gray-400" />
                                            <span className="text-white">{tenantSettings.contactNumber || 'N/A'}</span>
                                        </div>
                                        {tenantSettings.email && (
                                            <div className="flex items-center space-x-3">
                                                <Mail className="w-5 h-5 text-gray-400" />
                                                <span className="text-white">{tenantSettings.email}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="mt-6 space-y-3">
                                <button
                                    onClick={() => handleToggleStatus(selectedTenant)}
                                    className={`w-full py-3 rounded-xl font-medium ${selectedTenant.isActive
                                            ? 'bg-red-500 text-white'
                                            : 'bg-green-500 text-white'
                                        }`}
                                >
                                    {selectedTenant.isActive ? 'Deactivate Salon' : 'Activate Salon'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TenantManagementPage;
