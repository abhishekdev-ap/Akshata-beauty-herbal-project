// Customer Management Page - View and manage customers
import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Search, User, Mail, Phone, Calendar,
    DollarSign, Star, ChevronRight
} from 'lucide-react';
import { useTenant } from '../contexts/TenantContext';
import { firestoreService } from '../services/firestoreService';
import type { Appointment, User as UserType } from '../types';

interface CustomerManagementPageProps {
    onBack: () => void;
}

interface CustomerData {
    id: string;
    name: string;
    email: string;
    phone?: string;
    totalBookings: number;
    totalSpent: number;
    lastVisit?: string;
}

const CustomerManagementPage: React.FC<CustomerManagementPageProps> = ({ onBack }) => {
    const { tenant } = useTenant();
    const [customers, setCustomers] = useState<CustomerData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
    const [customerAppointments, setCustomerAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        loadCustomers();
    }, [tenant?.id]);

    const loadCustomers = async () => {
        if (!tenant?.id) return;
        setIsLoading(true);
        try {
            // Get all appointments and extract unique customers
            const appointments = await firestoreService.getAppointmentsByTenant(tenant.id);

            const customerMap = new Map<string, CustomerData>();

            appointments.forEach(apt => {
                const key = apt.customerEmail || apt.userId;
                if (!key) return;

                const existing = customerMap.get(key);
                if (existing) {
                    existing.totalBookings++;
                    existing.totalSpent += apt.totalPrice;
                    if (!existing.lastVisit || new Date(apt.date) > new Date(existing.lastVisit)) {
                        existing.lastVisit = apt.date;
                    }
                } else {
                    customerMap.set(key, {
                        id: key,
                        name: apt.customerName || 'Customer',
                        email: apt.customerEmail || '',
                        phone: apt.customerPhone,
                        totalBookings: 1,
                        totalSpent: apt.totalPrice,
                        lastVisit: apt.date
                    });
                }
            });

            setCustomers(Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent));
        } catch (error) {
            console.error('Error loading customers:', error);
        }
        setIsLoading(false);
    };

    const handleSelectCustomer = async (customer: CustomerData) => {
        setSelectedCustomer(customer);
        if (tenant?.id) {
            // Load customer's appointments
            const allAppointments = await firestoreService.getAppointmentsByTenant(tenant.id);
            const customerApts = allAppointments.filter(
                apt => apt.customerEmail === customer.email || apt.userId === customer.id
            );
            setCustomerAppointments(customerApts);
        }
    };

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm)
    );

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
                            <h1 className="text-2xl font-bold text-white">Customers</h1>
                            <p className="text-gray-400 text-sm">{customers.length} total customers</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search customers by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                    />
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-white/10">
                        <p className="text-gray-400 text-sm">Total Customers</p>
                        <p className="text-2xl font-bold text-white">{customers.length}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-white/10">
                        <p className="text-gray-400 text-sm">Total Bookings</p>
                        <p className="text-2xl font-bold text-blue-400">
                            {customers.reduce((sum, c) => sum + c.totalBookings, 0)}
                        </p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-white/10">
                        <p className="text-gray-400 text-sm">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-400">
                            ₹{customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Customer List */}
                {filteredCustomers.length === 0 ? (
                    <div className="text-center py-16">
                        <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No customers yet</h3>
                        <p className="text-gray-400">Customers will appear here after their first booking</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredCustomers.map((customer) => (
                            <div
                                key={customer.id}
                                onClick={() => handleSelectCustomer(customer)}
                                className="bg-gray-800/50 rounded-xl p-4 border border-white/10 hover:border-white/20 cursor-pointer transition-all flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {customer.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium">{customer.name}</h3>
                                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                                            {customer.email && (
                                                <span className="flex items-center space-x-1">
                                                    <Mail className="w-3 h-3" />
                                                    <span>{customer.email}</span>
                                                </span>
                                            )}
                                            {customer.phone && (
                                                <span className="flex items-center space-x-1">
                                                    <Phone className="w-3 h-3" />
                                                    <span>{customer.phone}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <div className="text-right">
                                        <p className="text-white font-medium">{customer.totalBookings} bookings</p>
                                        <p className="text-green-400 text-sm">₹{customer.totalSpent.toLocaleString()}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Customer Detail Sidebar */}
            {selectedCustomer && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end">
                    <div className="w-full max-w-md bg-gray-900 h-full overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">Customer Details</h2>
                                <button
                                    onClick={() => setSelectedCustomer(null)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Customer Info */}
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                    {selectedCustomer.name.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="text-xl font-semibold text-white">{selectedCustomer.name}</h3>
                                <p className="text-gray-400">{selectedCustomer.email}</p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                                    <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-white">{selectedCustomer.totalBookings}</p>
                                    <p className="text-gray-400 text-sm">Bookings</p>
                                </div>
                                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                                    <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-white">₹{selectedCustomer.totalSpent.toLocaleString()}</p>
                                    <p className="text-gray-400 text-sm">Total Spent</p>
                                </div>
                            </div>

                            {/* Booking History */}
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-4">Booking History</h4>
                                <div className="space-y-3">
                                    {customerAppointments.length === 0 ? (
                                        <p className="text-gray-400 text-center py-4">No bookings found</p>
                                    ) : (
                                        customerAppointments.map((apt) => (
                                            <div key={apt.id} className="bg-gray-800/50 rounded-lg p-3">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-white font-medium">
                                                        {new Date(apt.date).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${apt.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                                            apt.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                                                'bg-blue-500/20 text-blue-400'
                                                        }`}>
                                                        {apt.status}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-sm">
                                                    {apt.services.map(s => s.name).join(', ')}
                                                </p>
                                                <p className="text-green-400 font-medium mt-1">₹{apt.totalPrice}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerManagementPage;
