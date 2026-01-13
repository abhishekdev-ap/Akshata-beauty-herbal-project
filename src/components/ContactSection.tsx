import { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import EmailService, { ContactEmailData } from '../services/emailService';

interface ContactSectionProps {
    isDarkMode: boolean;
}

const ContactSection = ({ isDarkMode }: ContactSectionProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState<ContactEmailData>({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
    });
    const sectionRef = useRef<HTMLElement>(null);

    const contactInfo = [
        {
            icon: MapPin,
            title: 'Our Location',
            lines: ['Dharwad & Hubli, Karnataka', 'India'],
            color: 'from-pink-500 to-rose-500'
        },
        {
            icon: Phone,
            title: 'Phone Number',
            lines: ['+91 97403 03404'],
            color: 'from-purple-500 to-indigo-500'
        },
        {
            icon: Mail,
            title: 'Email Address',
            lines: ['akshatapattanashetti968@gmail.com'],
            color: 'from-amber-500 to-orange-500'
        },
        {
            icon: Clock,
            title: 'Working Hours',
            lines: ['Mon - Sat: 10:00 AM - 8:00 PM', 'Sunday: By Appointment'],
            color: 'from-emerald-500 to-teal-500'
        }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('sending');
        setErrorMessage('');

        try {
            const emailService = EmailService.getInstance();
            const result = await emailService.sendContactEmail(formData);

            if (result.success) {
                setFormStatus('sent');
                setFormData({ name: '', email: '', phone: '', service: '', message: '' });
                setTimeout(() => setFormStatus('idle'), 5000);
            } else {
                setFormStatus('error');
                setErrorMessage(result.error || 'Failed to send message. Please try again.');
                setTimeout(() => setFormStatus('idle'), 3000);
            }
        } catch (error) {
            setFormStatus('error');
            setErrorMessage('An unexpected error occurred.');
            setTimeout(() => setFormStatus('idle'), 3000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <section
            id="contact"
            ref={sectionRef}
            className={`py-24 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="inline-flex items-center space-x-2 mb-4">
                        <div className="h-px w-8 bg-gradient-to-r from-transparent to-pink-500" />
                        <span className={`text-sm font-medium tracking-widest uppercase ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                            Get In Touch
                        </span>
                        <div className="h-px w-8 bg-gradient-to-l from-transparent to-pink-500" />
                    </div>

                    <h2 className={`text-4xl md:text-5xl font-display font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Contact{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                            Us
                        </span>
                    </h2>

                    <p className={`max-w-2xl mx-auto text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Have questions or ready to book an appointment? We'd love to hear from you!
                    </p>
                </div>

                {/* Contact Info Cards */}
                <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    {contactInfo.map((info, index) => (
                        <div
                            key={info.title}
                            className={`group p-6 rounded-2xl transition-all duration-500 hover:-translate-y-2 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-pink-50/50 hover:bg-white hover:shadow-xl'
                                }`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center mb-4 
                            transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                <info.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {info.title}
                            </h3>
                            {info.lines.map((line, i) => (
                                <p key={i} className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {line}
                                </p>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Contact Form & Map */}
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                        <div className={`p-8 rounded-3xl ${isDarkMode ? 'bg-gray-800' : 'bg-pink-50/50'}`}>
                            <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Send Us a Message
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent ${isDarkMode
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                                                }`}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent ${isDarkMode
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                                                }`}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent ${isDarkMode
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                                                }`}
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Service Interested
                                        </label>
                                        <select
                                            name="service"
                                            value={formData.service}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent ${isDarkMode
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-200 text-gray-900'
                                                }`}
                                        >
                                            <option value="">Select a service</option>
                                            <option value="bridal">Bridal Makeup</option>
                                            <option value="hair">Hair Styling</option>
                                            <option value="skin">Skin Care</option>
                                            <option value="nails">Nail Art</option>
                                            <option value="spa">Spa & Wellness</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Your Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none ${isDarkMode
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                                            }`}
                                        placeholder="Tell us about your requirements..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={formStatus === 'sending'}
                                    className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300 
                           ${formStatus === 'sent'
                                            ? 'bg-green-500 text-white'
                                            : formStatus === 'error'
                                                ? 'bg-red-500 text-white'
                                                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 hover:shadow-lg hover:shadow-pink-500/30'
                                        } disabled:opacity-70`}
                                >
                                    {formStatus === 'sending' ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Sending...</span>
                                        </>
                                    ) : formStatus === 'sent' ? (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            <span>Message Sent!</span>
                                        </>
                                    ) : formStatus === 'error' ? (
                                        <>
                                            <AlertCircle className="w-5 h-5" />
                                            <span>{errorMessage || 'Failed!'}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Map - Clickable Card */}
                    <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        <a
                            href="https://www.google.com/maps/search/Akshata+Beauty+Parlour+Dharwad+Karnataka"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block h-full min-h-[400px] rounded-3xl overflow-hidden relative group cursor-pointer ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-pink-50 to-purple-100'}`}
                        >
                            {/* Map Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${isDarkMode ? '%23ffffff' : '%23000000'}' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                }} />
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                                {/* Location Pin */}
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300 ${isDarkMode ? 'bg-pink-500/20' : 'bg-pink-500/10'}`}>
                                    <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                        <MapPin className="w-7 h-7 text-white" />
                                    </div>
                                </div>

                                {/* Location Text */}
                                <h3 className={`text-2xl font-bold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                    Our Location
                                </h3>
                                <p className={`text-lg mb-1 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Dharwad & Hubli
                                </p>
                                <p className={`text-sm mb-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Karnataka, India
                                </p>

                                {/* Open Map Button */}
                                <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transform group-hover:scale-105 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                    <MapPin className="w-5 h-5" />
                                    <span>Open in Google Maps</span>
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute top-6 right-6">
                                    <div className={`w-3 h-3 rounded-full animate-ping ${isDarkMode ? 'bg-pink-400' : 'bg-pink-500'}`} />
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
