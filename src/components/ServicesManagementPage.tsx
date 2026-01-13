// Services Management Page - CRUD for salon services
import React, { useState, useEffect } from 'react';
import {
    Plus, Edit2, Trash2, ArrowLeft, Search, Filter,
    DollarSign, Clock, Tag, Check, X, Scissors
} from 'lucide-react';
import { useTenant } from '../contexts/TenantContext';
import { firestoreService } from '../services/firestoreService';
import type { Service } from '../types';

interface ServicesManagementPageProps {
    onBack: () => void;
}

const ServicesManagementPage: React.FC<ServicesManagementPageProps> = ({ onBack }) => {
    const { tenant } = useTenant();
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<'all' | 'regular' | 'bridal'>('all');
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        duration: '30',
        category: 'regular' as 'regular' | 'bridal',
        description: ''
    });

    useEffect(() => {
        loadServices();
    }, [tenant?.id]);

    const loadServices = async () => {
        if (!tenant?.id) return;
        setIsLoading(true);
        try {
            const data = await firestoreService.getServices(tenant.id, false);
            setServices(data);
        } catch (error) {
            console.error('Error loading services:', error);
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tenant?.id) return;

        try {
            if (editingService) {
                await firestoreService.updateService(editingService.id, {
                    name: formData.name,
                    price: parseFloat(formData.price),
                    duration: parseInt(formData.duration),
                    category: formData.category,
                    description: formData.description
                });
            } else {
                await firestoreService.createService(tenant.id, {
                    name: formData.name,
                    price: parseFloat(formData.price),
                    duration: parseInt(formData.duration),
                    category: formData.category,
                    description: formData.description,
                    isActive: true
                });
            }
            await loadServices();
            closeModal();
        } catch (error) {
            console.error('Error saving service:', error);
        }
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            price: service.price.toString(),
            duration: service.duration.toString(),
            category: service.category,
            description: service.description || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (serviceId: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return;
        try {
            await firestoreService.deleteService(serviceId);
            await loadServices();
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };

    const handleToggleActive = async (service: Service) => {
        try {
            await firestoreService.updateService(service.id, {
                isActive: !service.isActive
            });
            await loadServices();
        } catch (error) {
            console.error('Error toggling service:', error);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingService(null);
        setFormData({
            name: '',
            price: '',
            duration: '30',
            category: 'regular',
            description: ''
        });
    };

    const filteredServices = services.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
        return matchesSearch && matchesCategory;
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
            <header className="bg-gray-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onBack}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Services Management</h1>
                                <p className="text-gray-400 text-sm">{services.length} services</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Service</span>
                        </button>
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
                            placeholder="Search services..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value as any)}
                            className="px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500"
                        >
                            <option value="all">All Categories</option>
                            <option value="regular">Regular</option>
                            <option value="bridal">Bridal</option>
                        </select>
                    </div>
                </div>

                {/* Services Grid */}
                {filteredServices.length === 0 ? (
                    <div className="text-center py-16">
                        <Scissors className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No services yet</h3>
                        <p className="text-gray-400 mb-4">Add your first service to get started</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium"
                        >
                            Add Your First Service
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.map((service) => (
                            <div
                                key={service.id}
                                className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border transition-all ${service.isActive ? 'border-white/10 hover:border-white/20' : 'border-red-500/30 opacity-60'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${service.category === 'bridal'
                                                ? 'bg-pink-500/20 text-pink-400'
                                                : 'bg-purple-500/20 text-purple-400'
                                            }`}>
                                            {service.category}
                                        </span>
                                        <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                                    </div>
                                    <button
                                        onClick={() => handleToggleActive(service)}
                                        className={`p-2 rounded-lg transition-colors ${service.isActive
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                            }`}
                                    >
                                        {service.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                    </button>
                                </div>

                                {service.description && (
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{service.description}</p>
                                )}

                                <div className="flex items-center justify-between text-sm mb-4">
                                    <div className="flex items-center space-x-1 text-green-400">
                                        <DollarSign className="w-4 h-4" />
                                        <span className="font-semibold">₹{service.price}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-gray-400">
                                        <Clock className="w-4 h-4" />
                                        <span>{service.duration} min</span>
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(service)}
                                        className="flex-1 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center justify-center space-x-1"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center space-x-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-2xl w-full max-w-md p-6 border border-white/10">
                        <h2 className="text-xl font-bold text-white mb-6">
                            {editingService ? 'Edit Service' : 'Add New Service'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 text-sm mb-2">Service Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g., Hair Styling"
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-300 text-sm mb-2">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                        placeholder="500"
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm mb-2">Duration (min)</label>
                                    <input
                                        type="number"
                                        value={formData.duration}
                                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                                        placeholder="30"
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm mb-2">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500"
                                >
                                    <option value="regular">Regular</option>
                                    <option value="bridal">Bridal</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm mb-2">Description (optional)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Brief description of the service..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 resize-none"
                                />
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                                >
                                    {editingService ? 'Update' : 'Add Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesManagementPage;
