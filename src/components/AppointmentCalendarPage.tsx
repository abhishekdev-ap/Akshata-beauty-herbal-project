// Appointment Calendar Page - View and manage appointments
import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, ChevronLeft, ChevronRight, Calendar, Clock,
    User, Phone, MapPin, Check, X, AlertCircle
} from 'lucide-react';
import { useTenant } from '../contexts/TenantContext';
import { firestoreService } from '../services/firestoreService';
import type { Appointment } from '../types';

interface AppointmentCalendarPageProps {
    onBack: () => void;
}

const AppointmentCalendarPage: React.FC<AppointmentCalendarPageProps> = ({ onBack }) => {
    const { tenant } = useTenant();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'day' | 'week' | 'list'>('list');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    useEffect(() => {
        loadAppointments();
    }, [tenant?.id]);

    const loadAppointments = async () => {
        if (!tenant?.id) return;
        setIsLoading(true);
        try {
            const data = await firestoreService.getAppointmentsByTenant(tenant.id);
            setAppointments(data);
        } catch (error) {
            console.error('Error loading appointments:', error);
        }
        setIsLoading(false);
    };

    const handleStatusChange = async (appointmentId: string, status: Appointment['status']) => {
        try {
            await firestoreService.updateAppointment(appointmentId, { status });
            await loadAppointments();
            setSelectedAppointment(null);
        } catch (error) {
            console.error('Error updating appointment:', error);
        }
    };

    const getStatusColor = (status: Appointment['status']) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'confirmed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
    };

    const navigateDate = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (view === 'day') {
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        } else if (view === 'week') {
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        }
        setCurrentDate(newDate);
    };

    const todayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        const today = new Date();
        return aptDate.toDateString() === today.toDateString();
    });

    const upcomingAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return aptDate >= today && apt.status !== 'completed' && apt.status !== 'cancelled';
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button onClick={onBack} className="p-2 text-gray-400 hover:text-white">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Appointments</h1>
                                <p className="text-gray-400 text-sm">{appointments.length} total bookings</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {['list', 'day', 'week'].map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setView(v as any)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === v
                                            ? 'bg-pink-500 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {v.charAt(0).toUpperCase() + v.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-white/10">
                        <p className="text-gray-400 text-sm">Today</p>
                        <p className="text-2xl font-bold text-white">{todayAppointments.length}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-white/10">
                        <p className="text-gray-400 text-sm">Upcoming</p>
                        <p className="text-2xl font-bold text-blue-400">{upcomingAppointments.length}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-white/10">
                        <p className="text-gray-400 text-sm">Pending</p>
                        <p className="text-2xl font-bold text-yellow-400">
                            {appointments.filter(a => a.status === 'pending').length}
                        </p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-white/10">
                        <p className="text-gray-400 text-sm">Completed</p>
                        <p className="text-2xl font-bold text-green-400">
                            {appointments.filter(a => a.status === 'completed').length}
                        </p>
                    </div>
                </div>

                {/* Date Navigation (for day/week view) */}
                {view !== 'list' && (
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        <button onClick={() => navigateDate('prev')} className="p-2 text-gray-400 hover:text-white">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <span className="text-white font-medium">
                            {currentDate.toLocaleDateString('en-IN', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </span>
                        <button onClick={() => navigateDate('next')} className="p-2 text-gray-400 hover:text-white">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                )}

                {/* Appointments List */}
                {appointments.length === 0 ? (
                    <div className="text-center py-16">
                        <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No appointments yet</h3>
                        <p className="text-gray-400">Appointments will appear here when customers book</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {(view === 'list' ? upcomingAppointments : appointments).map((apt) => (
                            <div
                                key={apt.id}
                                onClick={() => setSelectedAppointment(apt)}
                                className="bg-gray-800/50 rounded-xl p-4 border border-white/10 hover:border-white/20 cursor-pointer transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                            {apt.customerName?.charAt(0) || 'C'}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-medium">{apt.customerName || 'Customer'}</h3>
                                            <div className="flex items-center space-x-3 text-sm text-gray-400">
                                                <span className="flex items-center space-x-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{formatDate(apt.date)}</span>
                                                </span>
                                                <span className="flex items-center space-x-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{apt.time}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
                                            {apt.status}
                                        </span>
                                        <p className="text-green-400 font-semibold mt-1">₹{apt.totalPrice}</p>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-white/5">
                                    <p className="text-gray-400 text-sm">
                                        {apt.services.map(s => s.name).join(', ')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Appointment Detail Modal */}
            {selectedAppointment && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-2xl w-full max-w-md p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Appointment Details</h2>
                            <button onClick={() => setSelectedAppointment(null)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <User className="w-5 h-5 text-gray-400" />
                                <span className="text-white">{selectedAppointment.customerName || 'Customer'}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <span className="text-white">{selectedAppointment.customerPhone || 'N/A'}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <span className="text-white">{formatDate(selectedAppointment.date)} at {selectedAppointment.time}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <span className="text-white capitalize">{selectedAppointment.serviceLocation}</span>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <p className="text-gray-400 text-sm mb-2">Services:</p>
                                <ul className="space-y-1">
                                    {selectedAppointment.services.map((s, i) => (
                                        <li key={i} className="text-white flex justify-between">
                                            <span>{s.name}</span>
                                            <span className="text-green-400">₹{s.price}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex justify-between mt-3 pt-3 border-t border-white/10 font-bold">
                                    <span className="text-white">Total</span>
                                    <span className="text-green-400">₹{selectedAppointment.totalPrice}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2 pt-4">
                                {selectedAppointment.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusChange(selectedAppointment.id, 'confirmed')}
                                            className="flex-1 py-3 bg-blue-500 text-white rounded-xl flex items-center justify-center space-x-2"
                                        >
                                            <Check className="w-4 h-4" />
                                            <span>Confirm</span>
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(selectedAppointment.id, 'cancelled')}
                                            className="flex-1 py-3 bg-red-500 text-white rounded-xl flex items-center justify-center space-x-2"
                                        >
                                            <X className="w-4 h-4" />
                                            <span>Cancel</span>
                                        </button>
                                    </>
                                )}
                                {selectedAppointment.status === 'confirmed' && (
                                    <button
                                        onClick={() => handleStatusChange(selectedAppointment.id, 'completed')}
                                        className="w-full py-3 bg-green-500 text-white rounded-xl flex items-center justify-center space-x-2"
                                    >
                                        <Check className="w-4 h-4" />
                                        <span>Mark as Completed</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentCalendarPage;
