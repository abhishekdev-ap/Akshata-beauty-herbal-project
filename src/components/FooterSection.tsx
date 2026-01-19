import { Sparkles, MapPin, Phone, Mail, Clock, Heart } from 'lucide-react';

interface FooterSectionProps {
    isDarkMode: boolean;
}

// Bootstrap Icons - Using icon fonts for guaranteed visibility on all devices
const ArrowUpIcon = () => (
    <i className="bi bi-arrow-up" style={{ fontSize: '20px', color: 'white' }}></i>
);

const FacebookIcon = () => (
    <i className="bi bi-facebook" style={{ fontSize: '18px', color: 'white' }}></i>
);

const TwitterIcon = () => (
    <i className="bi bi-twitter-x" style={{ fontSize: '18px', color: 'white' }}></i>
);

const InstagramIcon = () => (
    <i className="bi bi-instagram" style={{ fontSize: '18px', color: 'white' }}></i>
);

const YoutubeIcon = () => (
    <i className="bi bi-youtube" style={{ fontSize: '18px', color: 'white' }}></i>
);

const FooterSection = ({ isDarkMode }: FooterSectionProps) => {
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const quickLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About Us', href: '#about' },
        { name: 'Services', href: '#services' },
        { name: 'Gallery', href: '#gallery' },
        { name: 'Testimonials', href: '#testimonials' },
        { name: 'Contact', href: '#contact' }
    ];

    const services = [
        { name: 'Bridal Makeup', href: '#services' },
        { name: 'Hair Styling', href: '#services' },
        { name: 'Skin Care', href: '#services' },
        { name: 'Nail Art', href: '#services' },
        { name: 'Spa & Wellness', href: '#services' },
        { name: 'Party Makeup', href: '#services' }
    ];

    const socialLinks = [
        { icon: InstagramIcon, href: 'https://instagram.com', color: 'hover:bg-pink-600' },
        { icon: FacebookIcon, href: 'https://facebook.com', color: 'hover:bg-blue-600' },
        { icon: TwitterIcon, href: 'https://twitter.com', color: 'hover:bg-sky-500' },
        { icon: YoutubeIcon, href: 'https://youtube.com', color: 'hover:bg-red-600' }
    ];

    const scrollToSection = (href: string) => {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Top Wave Decoration */}
            <div className="absolute top-0 left-0 right-0 overflow-hidden">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16">
                    <path
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                        className={isDarkMode ? 'fill-gray-800' : 'fill-white'}
                    />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div>
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white font-display">AKSHATA</h3>
                                <p className="text-xs text-pink-400 tracking-wide uppercase">BEAUTY HERBAL PARLOUR</p>
                            </div>
                        </div>

                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Your premier destination for beauty and bridal services.
                            Experience luxury, expertise, and personalized care.
                        </p>

                        {/* Social Links */}
                        <div className="flex space-x-3">
                            {socialLinks.map((social, index) => (
                                <button
                                    key={index}
                                    onClick={() => alert('Coming Soon!')}
                                    className={`w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center 
                           transition-all duration-300 ${social.color} group cursor-pointer`}
                                >
                                    <social.icon />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 relative inline-block">
                            Quick Links
                            <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600" />
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <button
                                        onClick={() => scrollToSection(link.href)}
                                        className="text-gray-400 hover:text-pink-400 transition-colors duration-300 flex items-center space-x-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 bg-pink-500 rounded-full opacity-100 group-hover:opacity-100 transition-opacity" />
                                        <span>{link.name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 relative inline-block">
                            Our Services
                            <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600" />
                        </h4>
                        <ul className="space-y-3">
                            {services.map((service) => (
                                <li key={service.name}>
                                    <button
                                        onClick={() => scrollToSection(service.href)}
                                        className="text-gray-400 hover:text-pink-400 transition-colors duration-300"
                                    >
                                        {service.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 relative inline-block">
                            Contact Us
                            <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600" />
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-gray-400">
                                <MapPin className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
                                <span>Hubli, Karnataka, India - 580001</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400">
                                <Phone className="w-5 h-5 text-pink-500 flex-shrink-0" />
                                <span>+91 97403 03404</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400">
                                <Mail className="w-5 h-5 text-pink-500 flex-shrink-0" />
                                <span>akshatapattanashetti968@gmail.com</span>
                            </li>
                            <li className="flex items-start space-x-3 text-gray-400">
                                <Clock className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p>Mon - Sat: 10AM - 8PM</p>
                                    <p>Sunday: By Appointment</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-400 text-sm text-center md:text-left">
                        © {currentYear} AKSHATA BEAUTY HERBAL PARLOUR. All rights reserved. Made with{' '}
                        <Heart className="w-4 h-4 inline text-pink-500 fill-current" /> in India
                    </p>

                    <div className="flex items-center space-x-4 sm:space-x-6 text-sm text-gray-400">
                        <a href="#" className="hover:text-pink-400 transition-colors">Privacy Policy</a>

                        {/* Scroll to Top Button - Inline on mobile */}
                        <button
                            onClick={scrollToTop}
                            className="sm:hidden w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center 
                             shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 transition-all duration-300"
                        >
                            <i className="bi bi-arrow-up" style={{ fontSize: '14px', color: 'white' }}></i>
                        </button>

                        <a href="#" className="hover:text-pink-400 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button - Fixed position on desktop only */}
            <button
                onClick={scrollToTop}
                className="hidden sm:flex fixed bottom-24 right-6 w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full items-center justify-center 
                 shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 transition-all duration-300 hover:-translate-y-1 z-50"
            >
                <i className="bi bi-arrow-up" style={{ fontSize: '20px', color: 'white' }}></i>
            </button>
        </footer>
    );
};

export default FooterSection;
