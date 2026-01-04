import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Save,
    Building2,
    Phone,
    Mail,
    MapPin,
    Clock,
    Home,
    IndianRupee,
    CheckCircle2,
    Settings,
    Send,
    AlertTriangle
} from 'lucide-react';
import BusinessStore, { BusinessSettings } from '../services/businessStore';
import EmailService from '../services/emailService';

interface BusinessSettingsPageProps {
    onBack: () => void;
    isDarkMode: boolean;
}

export default function BusinessSettingsPage({ onBack, isDarkMode }: BusinessSettingsPageProps) {
    const [settings, setSettings] = useState<BusinessSettings | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const [isSendingTest, setIsSendingTest] = useState(false);

    const businessStore = BusinessStore.getInstance();
    const emailService = EmailService.getInstance();

    useEffect(() => {
        setSettings(businessStore.getSettings());
    }, []);

    const handleSave = () => {
        if (!settings) return;

        setIsSaving(true);
        businessStore.updateSettings(settings);

        setTimeout(() => {
            setIsSaving(false);
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 2000);
        }, 500);
    };

    const handleTestEmail = async () => {
        if (!settings?.emailNotificationEnabled) return;

        setIsSendingTest(true);
        try {
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            const formattedTime = today.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

            await emailService.sendAppointmentNotificationEmail({
                customerName: "Test User",
                customerEmail: "test@example.com",
                customerPhone: "9876543210",
                services: ["Test Service 1", "Test Service 2"],
                appointmentDate: formattedDate,
                appointmentTime: formattedTime,
                totalAmount: 1500,
                appointmentId: `TEST-${Date.now()}`,
                serviceLocation: "parlor"
            });

            alert("Test email sent! Check your inbox (and spam folder).");
        } catch (error) {
            console.error("Test email failed:", error);
            alert("Failed to send test email. Check console for details.");
        } finally {
            setIsSendingTest(false);
        }
    };

    const updateSetting = <K extends keyof BusinessSettings>(key: K, value: BusinessSettings[K]) => {
        if (settings) {
            setSettings({ ...settings, [key]: value });
        }
    };

    if (!settings) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <header className={`sticky top-0 z-40 ${isDarkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-md border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBack}
                                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
                                <ArrowLeft className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                                    <Settings className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Business Settings
                                    </h1>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Configure your parlor details
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50"
                        >
                            {isSaving ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : showSaved ? (
                                <CheckCircle2 className="w-4 h-4" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {showSaved ? 'Saved!' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
                {/* Basic Info */}
                <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                    <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <Building2 className="w-5 h-5 text-pink-500" />
                        Basic Information
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Parlor Name
                            </label>
                            <input
                                type="text"
                                value={settings.parlorName}
                                onChange={(e) => updateSetting('parlorName', e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Owner Name
                            </label>
                            <input
                                type="text"
                                value={settings.ownerName}
                                onChange={(e) => updateSetting('ownerName', e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Tagline (Optional)
                            </label>
                            <input
                                type="text"
                                value={settings.tagline || ''}
                                onChange={(e) => updateSetting('tagline', e.target.value)}
                                placeholder="e.g., Beauty & Bridal Services"
                                className={`w-full px-4 py-2.5 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'border-gray-300'} focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                    <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <Phone className="w-5 h-5 text-pink-500" />
                        Contact Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                value={settings.contactNumber}
                                onChange={(e) => updateSetting('contactNumber', e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                WhatsApp Number
                            </label>
                            <input
                                type="tel"
                                value={settings.whatsappNumber || ''}
                                onChange={(e) => updateSetting('whatsappNumber', e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Email (Optional)
                            </label>
                            <input
                                type="email"
                                value={settings.email || ''}
                                onChange={(e) => updateSetting('email', e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                            />
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                    <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <MapPin className="w-5 h-5 text-pink-500" />
                        Location
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Parlor Address
                            </label>
                            <textarea
                                value={settings.address}
                                onChange={(e) => updateSetting('address', e.target.value)}
                                rows={2}
                                className={`w-full px-4 py-2.5 rounded-lg border resize-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                City
                            </label>
                            <input
                                type="text"
                                value={settings.city}
                                onChange={(e) => updateSetting('city', e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                            />
                        </div>
                    </div>
                </div>

                {/* Home Service Settings */}
                <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                    <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <Home className="w-5 h-5 text-pink-500" />
                        Home Service
                    </h2>

                    <div className="space-y-4">
                        {/* Toggle */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Enable Home Visits
                                </p>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Allow customers to book home service
                                </p>
                            </div>
                            <button
                                onClick={() => updateSetting('homeServiceEnabled', !settings.homeServiceEnabled)}
                                className={`relative w-14 h-7 rounded-full transition-colors ${settings.homeServiceEnabled
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-600'
                                    : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                                    }`}
                            >
                                <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${settings.homeServiceEnabled ? 'translate-x-7' : 'translate-x-0.5'
                                    }`} />
                            </button>
                        </div>

                        {/* Extra Charge */}
                        {settings.homeServiceEnabled && (
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Home Visit Extra Charge (₹)
                                </label>
                                <div className="relative">
                                    <IndianRupee className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <input
                                        type="number"
                                        value={settings.homeServiceExtraCharge}
                                        onChange={(e) => updateSetting('homeServiceExtraCharge', Number(e.target.value))}
                                        min="0"
                                        className={`w-full pl-9 pr-4 py-2.5 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                                    />
                                </div>
                                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Set to 0 for no extra charge
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Working Hours */}
                <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                    <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <Clock className="w-5 h-5 text-pink-500" />
                        Working Hours
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Opening Time
                            </label>
                            <input
                                type="time"
                                value={settings.workingHours.start}
                                onChange={(e) => updateSetting('workingHours', { ...settings.workingHours, start: e.target.value })}
                                className={`w-full px-4 py-2.5 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Closing Time
                            </label>
                            <input
                                type="time"
                                value={settings.workingHours.end}
                                onChange={(e) => updateSetting('workingHours', { ...settings.workingHours, end: e.target.value })}
                                className={`w-full px-4 py-2.5 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                            />
                        </div>
                    </div>
                </div>

                {/* Email Notification Settings */}
                <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                    <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <Mail className="w-5 h-5 text-pink-500" />
                        Email Notifications
                    </h2>

                    <div className="space-y-6">
                        {/* Enable Toggle */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Enable Email Notifications
                                </p>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Receive appointment alerts via email
                                </p>
                            </div>
                            <button
                                onClick={() => updateSetting('emailNotificationEnabled', !settings.emailNotificationEnabled)}
                                className={`relative w-14 h-7 rounded-full transition-colors ${settings.emailNotificationEnabled
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-600'
                                    : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                                    }`}
                            >
                                <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${settings.emailNotificationEnabled ? 'translate-x-7' : 'translate-x-0.5'
                                    }`} />
                            </button>
                        </div>

                        {/* Web3Forms Setup Instructions */}
                        {settings.emailNotificationEnabled && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-blue-50 border-blue-100'}`}>
                                    <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                                        ⏳ Setup Web3Forms (Ranked #1 Free Email Service)
                                    </h4>
                                    <ol className={`list-decimal list-inside space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-blue-700'}`}>
                                        <li>Go to <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">web3forms.com</a></li>
                                        <li>Enter your email address (where you want to receive alerts)</li>
                                        <li>Check your inbox for the Access Key</li>
                                        <li>Paste the Access Key below</li>
                                    </ol>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Web3Forms Access Key
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.web3FormsAccessKey || ''}
                                        onChange={(e) => updateSetting('web3FormsAccessKey', e.target.value)}
                                        placeholder="e.g., a1b2c3d4-e5f6-..."
                                        className={`w-full px-4 py-2.5 rounded-lg border font-mono ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'border-gray-300'} focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                                    />
                                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        This key is required to send emails securely without a backend server.
                                    </p>
                                </div>

                                <button
                                    onClick={handleTestEmail}
                                    disabled={isSendingTest || !settings.web3FormsAccessKey}
                                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${!settings.web3FormsAccessKey
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : isDarkMode
                                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                                        }`}
                                >
                                    {isSendingTest ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    Send Test Email
                                </button>

                                {!settings.web3FormsAccessKey && (
                                    <div className="flex items-center gap-2 text-xs text-amber-500 bg-amber-50 p-2 rounded border border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/50">
                                        <AlertTriangle className="w-3 h-3" />
                                        Please save a valid Access Key to test email delivery.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
