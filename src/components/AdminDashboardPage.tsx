import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Plus,
    Edit2,
    Trash2,
    Package,
    Scissors,
    Crown,
    RefreshCw,
    LayoutDashboard,
    AlertTriangle,
    CheckCircle2,
    Settings
} from 'lucide-react';
import { Service } from '../types';
import ServiceStore from '../services/serviceStore';
import ServiceFormModal from './admin/ServiceFormModal';

interface AdminDashboardPageProps {
    onBack: () => void;
    onBusinessSettings?: () => void;
    isDarkMode: boolean;
}

export default function AdminDashboardPage({ onBack, onBusinessSettings, isDarkMode }: AdminDashboardPageProps) {
    const [services, setServices] = useState<Service[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'regular' | 'bridal'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const serviceStore = ServiceStore.getInstance();

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = () => {
        setServices(serviceStore.getServices());
    };

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleAddService = (serviceData: Omit<Service, 'id'>) => {
        serviceStore.addService(serviceData);
        loadServices();
        showNotification('success', 'Service added successfully!');
    };

    const handleEditService = (serviceData: Omit<Service, 'id'>) => {
        if (editingService) {
            serviceStore.updateService(editingService.id, serviceData);
            loadServices();
            setEditingService(null);
            showNotification('success', 'Service updated successfully!');
        }
    };

    const handleDeleteService = (id: string) => {
        serviceStore.deleteService(id);
        loadServices();
        setDeleteConfirm(null);
        showNotification('success', 'Service deleted successfully!');
    };

    const handleResetToDefaults = () => {
        if (confirm('Are you sure you want to reset all services to defaults? This will reload services from the default list.')) {
            serviceStore.resetToDefaults();
            loadServices();
            showNotification('success', 'Services reset to defaults!');
        }
    };

    const openEditModal = (service: Service) => {
        setEditingService(service);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
    };

    // Filter services
    const filteredServices = services.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()));

        if (activeTab === 'all') return matchesSearch;
        return matchesSearch && service.category === activeTab;
    });



    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <header className={`sticky top-0 z-40 ${isDarkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-md border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="max-w-7xl mx-auto px-4 py-4">
                    {/* Mobile Layout */}
                    <div className="md:hidden">
                        {/* Top row: Back button and Title */}
                        <div className="flex items-center gap-3 mb-4">
                            <button
                                onClick={onBack}
                                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
                                <ArrowLeft className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                            </button>
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                <LayoutDashboard className="w-4 h-4 text-white" />
                            </div>
                            <div className="min-w-0">
                                <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Admin Dashboard
                                </h1>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Manage services & prices
                                </p>
                            </div>
                        </div>
                        {/* Bottom row: Action buttons */}
                        <div className="flex items-center gap-2">
                            {onBusinessSettings && (
                                <button
                                    onClick={onBusinessSettings}
                                    className={`flex items-center justify-center p-2.5 rounded-lg transition-colors ${isDarkMode
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    title="Settings"
                                >
                                    <Settings className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                onClick={handleResetToDefaults}
                                className={`flex items-center justify-center p-2.5 rounded-lg transition-colors ${isDarkMode
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                title="Reset to defaults"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Add Service
                            </button>
                        </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBack}
                                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
                                <ArrowLeft className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                                    <LayoutDashboard className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Admin Dashboard
                                    </h1>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Manage your services & prices
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {onBusinessSettings && (
                                <button
                                    onClick={onBusinessSettings}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </button>
                            )}
                            <button
                                onClick={handleResetToDefaults}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reset
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Add Service
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Notification */}
            {notification && (
                <div className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${notification.type === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                    }`}>
                    {notification.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5" />
                    ) : (
                        <AlertTriangle className="w-5 h-5" />
                    )}
                    {notification.message}
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Search & Filters */}
                <div className={`p-4 rounded-2xl mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search services..."
                                className={`w-full px-4 py-2.5 rounded-lg border ${isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                                    } focus:outline-none focus:ring-2 focus:ring-pink-500`}
                            />
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2">
                            {(['all', 'regular', 'bridal'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2.5 rounded-lg font-medium transition-all ${activeTab === tab
                                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                                        : isDarkMode
                                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Services List */}
                <div className={`rounded-2xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                    {/* Table Header - Hidden on mobile */}
                    <div className={`hidden md:grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium ${isDarkMode ? 'bg-gray-750 text-gray-400' : 'bg-gray-50 text-gray-500'
                        }`}>
                        <div className="col-span-4">Service Name</div>
                        <div className="col-span-2">Category</div>
                        <div className="col-span-2">Price</div>
                        <div className="col-span-2">Duration</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredServices.length === 0 ? (
                            <div className={`px-6 py-12 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="font-medium">No services found</p>
                                <p className="text-sm">Try adjusting your search or filters</p>
                            </div>
                        ) : (
                            filteredServices.map((service) => (
                                <div
                                    key={service.id}
                                    className={`transition-colors ${isDarkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}`}
                                >
                                    {/* Desktop View */}
                                    <div className={`hidden md:grid grid-cols-12 gap-4 px-6 py-4 items-center`}>
                                        {/* Name & Description */}
                                        <div className="col-span-4">
                                            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {service.name}
                                            </p>
                                            {service.description && (
                                                <p className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {service.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Category Badge */}
                                        <div className="col-span-2">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${service.category === 'bridal'
                                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                : 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
                                                }`}>
                                                {service.category === 'bridal' ? (
                                                    <Crown className="w-3 h-3" />
                                                ) : (
                                                    <Scissors className="w-3 h-3" />
                                                )}
                                                {service.category}
                                            </span>
                                        </div>

                                        {/* Price */}
                                        <div className="col-span-2">
                                            <span className={`font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                                ₹{service.price.toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Duration */}
                                        <div className="col-span-2">
                                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                                {service.duration} min
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-2 flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(service)}
                                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                                                    }`}
                                                title="Edit service"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>

                                            {deleteConfirm === service.id ? (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleDeleteService(service.id)}
                                                        className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                                                        title="Confirm delete"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                                        title="Cancel"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setDeleteConfirm(service.id)}
                                                    className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-500'
                                                        }`}
                                                    title="Delete service"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Mobile View - Card Layout */}
                                    <div className="md:hidden p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {service.name}
                                                </p>
                                                {service.description && (
                                                    <p className={`text-sm mt-1 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {service.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <button
                                                    onClick={() => openEditModal(service)}
                                                    className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-blue-400' : 'hover:bg-blue-50 text-blue-500'}`}
                                                    title="Edit service"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                {deleteConfirm === service.id ? (
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleDeleteService(service.id)}
                                                            className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                                                            title="Confirm delete"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(null)}
                                                            className={`p-2 rounded-lg text-xs ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                                            title="Cancel"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setDeleteConfirm(service.id)}
                                                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-500'}`}
                                                        title="Delete service"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 mt-3 flex-wrap">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${service.category === 'bridal'
                                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                : 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
                                                }`}>
                                                {service.category === 'bridal' ? <Crown className="w-3 h-3" /> : <Scissors className="w-3 h-3" />}
                                                {service.category}
                                            </span>
                                            <span className={`font-bold text-green-600 dark:text-green-400`}>
                                                ₹{service.price.toLocaleString()}
                                            </span>
                                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {service.duration} min
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* Service Form Modal */}
            <ServiceFormModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={editingService ? handleEditService : handleAddService}
                editingService={editingService}
                isDarkMode={isDarkMode}
            />
        </div>
    );
}
