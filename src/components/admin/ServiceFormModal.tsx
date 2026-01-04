import { useState, useEffect } from 'react';
import {
    Scissors,
    Crown,
    Save,
    X,
    DollarSign,
    Clock,
    AlertCircle
} from 'lucide-react';
import { Service } from '../../types';

interface ServiceFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (service: Omit<Service, 'id'>) => void;
    editingService?: Service | null;
    isDarkMode: boolean;
}

export default function ServiceFormModal({
    isOpen,
    onClose,
    onSave,
    editingService,
    isDarkMode
}: ServiceFormModalProps) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [category, setCategory] = useState<'regular' | 'bridal'>('regular');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (editingService) {
            setName(editingService.name);
            setPrice(editingService.price.toString());
            setDuration(editingService.duration.toString());
            setCategory(editingService.category);
            setDescription(editingService.description || '');
        } else {
            resetForm();
        }
    }, [editingService, isOpen]);

    const resetForm = () => {
        setName('');
        setPrice('');
        setDuration('');
        setCategory('regular');
        setDescription('');
        setErrors({});
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) {
            newErrors.name = 'Service name is required';
        }

        if (!price || isNaN(Number(price)) || Number(price) <= 0) {
            newErrors.price = 'Please enter a valid price';
        }

        if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) {
            newErrors.duration = 'Please enter duration in minutes';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        onSave({
            name: name.trim(),
            price: Number(price),
            duration: Number(duration),
            category,
            description: description.trim() || undefined
        });

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`relative w-full max-w-md rounded-2xl shadow-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                } p-6 transform transition-all`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {editingService ? 'Edit Service' : 'Add New Service'}
                    </h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                            }`}
                    >
                        <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Service Name */}
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            Service Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Gold Facial"
                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.name
                                ? 'border-red-500 focus:ring-red-500'
                                : isDarkMode
                                    ? 'border-gray-600 bg-gray-700 text-white focus:ring-pink-500'
                                    : 'border-gray-300 focus:ring-pink-500'
                                } focus:outline-none focus:ring-2`}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Price & Duration Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                Price (₹) *
                            </label>
                            <div className="relative">
                                <DollarSign className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`} />
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="500"
                                    min="1"
                                    className={`w-full pl-9 pr-4 py-2.5 rounded-lg border ${errors.price
                                        ? 'border-red-500 focus:ring-red-500'
                                        : isDarkMode
                                            ? 'border-gray-600 bg-gray-700 text-white focus:ring-pink-500'
                                            : 'border-gray-300 focus:ring-pink-500'
                                        } focus:outline-none focus:ring-2`}
                                />
                            </div>
                            {errors.price && (
                                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.price}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                Duration (min) *
                            </label>
                            <div className="relative">
                                <Clock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`} />
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    placeholder="30"
                                    min="1"
                                    className={`w-full pl-9 pr-4 py-2.5 rounded-lg border ${errors.duration
                                        ? 'border-red-500 focus:ring-red-500'
                                        : isDarkMode
                                            ? 'border-gray-600 bg-gray-700 text-white focus:ring-pink-500'
                                            : 'border-gray-300 focus:ring-pink-500'
                                        } focus:outline-none focus:ring-2`}
                                />
                            </div>
                            {errors.duration && (
                                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.duration}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            Category *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setCategory('regular')}
                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${category === 'regular'
                                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-600'
                                    : isDarkMode
                                        ? 'border-gray-600 text-gray-400 hover:border-gray-500'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    }`}
                            >
                                <Scissors className="w-4 h-4" />
                                <span className="font-medium">Regular</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setCategory('bridal')}
                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${category === 'bridal'
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600'
                                    : isDarkMode
                                        ? 'border-gray-600 text-gray-400 hover:border-gray-500'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    }`}
                            >
                                <Crown className="w-4 h-4" />
                                <span className="font-medium">Bridal</span>
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            Description (Optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of the service..."
                            rows={3}
                            className={`w-full px-4 py-2.5 rounded-lg border resize-none ${isDarkMode
                                ? 'border-gray-600 bg-gray-700 text-white focus:ring-pink-500'
                                : 'border-gray-300 focus:ring-pink-500'
                                } focus:outline-none focus:ring-2`}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${isDarkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 rounded-lg font-medium bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {editingService ? 'Update' : 'Add Service'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
