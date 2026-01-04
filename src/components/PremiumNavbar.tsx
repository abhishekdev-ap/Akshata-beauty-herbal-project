import { useState, useEffect } from 'react';
import { Menu, X, Phone, ChevronDown, Sun, Moon, Sparkles, Settings, LogOut } from 'lucide-react';

interface PremiumNavbarProps {
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
    onBookNow: () => void;
    onAdminDashboard?: () => void;
    onLogout?: () => void;
    isUserAdmin?: boolean;
    currentSection?: string;
}

const PremiumNavbar = ({ isDarkMode, onToggleDarkMode, onBookNow, onAdminDashboard, onLogout, isUserAdmin, currentSection }: PremiumNavbarProps) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        {
            name: 'Services',
            href: '#services',
            dropdown: [
                { name: 'Hair Care', href: '#services-hair' },
                { name: 'Skin Care', href: '#services-skin' },
                { name: 'Bridal', href: '#services-bridal' },
                { name: 'Makeup', href: '#services-makeup' },
            ]
        },
        { name: 'Gallery', href: '#gallery' },
        { name: 'Testimonials', href: '#testimonials' },
        { name: 'Contact', href: '#contact' },
    ];

    const scrollToSection = (href: string) => {
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? isDarkMode
                        ? 'bg-gray-900/95 backdrop-blur-lg shadow-lg shadow-purple-500/10'
                        : 'bg-white/95 backdrop-blur-lg shadow-lg shadow-pink-500/10'
                    : 'bg-black/30 backdrop-blur-sm'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => scrollToSection('#home')}>
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-pink-500/50 transition-all duration-300">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                            </div>
                            <div>
                                <h2 className={`text-xl font-bold font-display transition-colors duration-300 ${isScrolled
                                    ? isDarkMode ? 'text-white' : 'text-gray-900'
                                    : 'text-white'
                                    }`}>
                                    AKSHATA
                                </h2>
                                <p className={`text-xs tracking-[0.15em] uppercase transition-colors duration-300 ${isScrolled
                                    ? isDarkMode ? 'text-pink-400' : 'text-pink-600'
                                    : 'text-pink-200'
                                    }`}>
                                    BEAUTY HERBAL PARLOUR
                                </p>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <div
                                    key={link.name}
                                    className="relative"
                                    onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <button
                                        onClick={() => scrollToSection(link.href)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-1 ${isScrolled
                                            ? isDarkMode
                                                ? 'text-gray-300 hover:text-pink-400 hover:bg-gray-800'
                                                : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
                                            : 'text-white/90 hover:text-white hover:bg-white/10'
                                            } ${currentSection === link.href.slice(1) ? 'text-pink-500' : ''}`}
                                    >
                                        <span>{link.name}</span>
                                        {link.dropdown && <ChevronDown className="w-4 h-4" />}
                                    </button>

                                    {/* Dropdown Menu */}
                                    {link.dropdown && activeDropdown === link.name && (
                                        <div className={`absolute top-full left-0 mt-2 w-48 rounded-xl shadow-xl overflow-hidden animate-fade-in-down ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
                                            }`}>
                                            {link.dropdown.map((item) => (
                                                <button
                                                    key={item.name}
                                                    onClick={() => scrollToSection(item.href)}
                                                    className={`w-full text-left px-4 py-3 transition-colors duration-200 ${isDarkMode
                                                        ? 'text-gray-300 hover:text-pink-400 hover:bg-gray-700'
                                                        : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
                                                        }`}
                                                >
                                                    {item.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right Side Actions */}
                        <div className="hidden lg:flex items-center space-x-4">
                            {/* Phone Number */}
                            <a
                                href="tel:+919740303404"
                                className={`flex items-center space-x-2 transition-colors duration-300 ${isScrolled
                                    ? isDarkMode ? 'text-gray-300 hover:text-pink-400' : 'text-gray-700 hover:text-pink-600'
                                    : 'text-white/90 hover:text-white'
                                    }`}
                            >
                                <Phone className="w-4 h-4" />
                                <span className="text-sm font-medium">+91 97403 03404</span>
                            </a>

                            {/* Dark Mode Toggle - Pill Switch Style */}
                            <button
                                onClick={onToggleDarkMode}
                                className={`relative flex items-center w-16 h-8 rounded-full p-1 transition-all duration-300 ${isDarkMode
                                    ? 'bg-purple-600'
                                    : 'bg-gray-300'
                                    }`}
                            >
                                {/* Toggle Circle with Icon */}
                                <div
                                    className={`absolute w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300 ${isDarkMode ? 'translate-x-8' : 'translate-x-0'
                                        }`}
                                >
                                    {isDarkMode
                                        ? <Moon className="w-4 h-4 text-purple-600" />
                                        : <Sun className="w-4 h-4 text-yellow-500" />
                                    }
                                </div>
                            </button>

                            {/* Book Now Button */}
                            <button
                                onClick={onBookNow}
                                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2.5 rounded-full font-semibold 
                         transition-all duration-300 hover:from-pink-600 hover:to-purple-700 hover:shadow-lg 
                         hover:shadow-pink-500/30 transform hover:-translate-y-0.5"
                            >
                                Book Now
                            </button>

                            {/* Admin Dashboard Button - Only visible to admin */}
                            {onAdminDashboard && isUserAdmin && (
                                <button
                                    onClick={onAdminDashboard}
                                    className={`p-2 rounded-full transition-all duration-300 ${isScrolled
                                        ? isDarkMode
                                            ? 'bg-gray-800 text-pink-400 hover:bg-gray-700'
                                            : 'bg-gray-100 text-pink-600 hover:bg-gray-200'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                    title="Admin Dashboard"
                                >
                                    <Settings className="w-5 h-5" />
                                </button>
                            )}

                            {/* Logout Button */}
                            {onLogout && (
                                <button
                                    onClick={onLogout}
                                    className={`p-2 rounded-full transition-all duration-300 ${isScrolled
                                        ? isDarkMode
                                            ? 'bg-gray-800 text-red-400 hover:bg-gray-700'
                                            : 'bg-gray-100 text-red-500 hover:bg-red-50'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                    title="Sign Out"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center space-x-3">
                            {/* Dark Mode Toggle - Pill Switch Style (Mobile) */}
                            {/* Dark Mode Toggle - Pill Switch Style (Mobile) - Matched to Desktop */}
                            <button
                                onClick={onToggleDarkMode}
                                className={`relative flex items-center w-14 h-7 rounded-full p-1 transition-all duration-300 ${isDarkMode
                                    ? 'bg-purple-600'
                                    : 'bg-gray-300'
                                    }`}
                            >
                                {/* Toggle Circle with Icon */}
                                <div
                                    className={`absolute w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300 ${isDarkMode ? 'translate-x-7' : 'translate-x-0'
                                        }`}
                                >
                                    {isDarkMode
                                        ? <Moon className="w-3 h-3 text-purple-600" />
                                        : <Sun className="w-3 h-3 text-yellow-500" />
                                    }
                                </div>
                            </button>

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`p-2 rounded-lg transition-all duration-300 ${isScrolled
                                    ? isDarkMode
                                        ? 'text-white hover:bg-gray-800'
                                        : 'text-gray-900 hover:bg-gray-100'
                                    : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`lg:hidden transition-all duration-500 overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className={`px-4 py-6 space-y-2 ${isDarkMode ? 'bg-gray-900' : 'bg-white'
                        }`}>
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => scrollToSection(link.href)}
                                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${isDarkMode
                                    ? 'text-gray-300 hover:text-pink-400 hover:bg-gray-800'
                                    : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
                                    }`}
                            >
                                {link.name}
                            </button>
                        ))}

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <a
                                href="tel:+919740303404"
                                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-200 ${isDarkMode
                                    ? 'text-gray-300 hover:text-pink-400 hover:bg-gray-800'
                                    : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
                                    }`}
                            >
                                <Phone className="w-5 h-5" />
                                <span>+91 97403 03404</span>
                            </a>

                            {/* Dark Mode Toggle in Mobile Menu */}
                            <button
                                onClick={onToggleDarkMode}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 ${isDarkMode
                                    ? 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800'
                                    : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
                                    }`}
                            >
                                <span className="flex items-center space-x-2">
                                    {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
                                    <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                                </span>
                                <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isDarkMode ? 'bg-purple-600' : 'bg-gray-300'}`}>
                                    <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    onBookNow();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold 
                         transition-all duration-300 hover:from-pink-600 hover:to-purple-700"
                            >
                                Book Appointment
                            </button>

                            {/* Logout Button (Mobile) */}
                            {onLogout && (
                                <button
                                    onClick={() => {
                                        onLogout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 mt-2 flex items-center space-x-2 ${isDarkMode
                                        ? 'text-red-400 hover:bg-gray-800'
                                        : 'text-red-500 hover:bg-red-50'
                                        }`}
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Sign Out</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Spacer for fixed navbar */}
            <div className="h-20"></div>
        </>
    );
};

export default PremiumNavbar;
