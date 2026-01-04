import { useEffect, useRef, useState } from 'react';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';

interface ServicesShowcaseProps {
    isDarkMode: boolean;
    onBookService: (serviceName?: string) => void;
}

const ServicesShowcase = ({ isDarkMode, onBookService }: ServicesShowcaseProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');
    const sectionRef = useRef<HTMLElement>(null);

    const categories = [
        { id: 'all', name: 'All Services' },
        { id: 'hair', name: 'Hair Care' },
        { id: 'skin', name: 'Skin Care' },
        { id: 'bridal', name: 'Bridal' },
        { id: 'makeup', name: 'Makeup' },
        { id: 'spa', name: 'Spa & Wellness' }
    ];

    // Base URL for assets
    const BASE_URL = import.meta.env.BASE_URL;

    const services = [
        {
            id: 1,
            name: "Bridal Makeup Package",
            category: "bridal",
            price: 15000,
            duration: "4 hours",
            image: `${BASE_URL}bridal-makeup.jpg`,
            description: "Complete bridal makeup with premium products and traditional styling",
            popular: true
        },
        {
            id: 2,
            name: "Complete Bridal Look",
            category: "bridal",
            price: 25000,
            duration: "5 hours",
            image: `${BASE_URL}bridal-complete.jpg`,
            description: "Full bridal package with makeup, hair, draping and jewelry styling",
            popular: true
        },
        {
            id: 3,
            name: "Party Makeup",
            category: "makeup",
            price: 2500,
            duration: "1.5 hours",
            image: `${BASE_URL}party-makeup.jpg`,
            description: "Glamorous makeup for special occasions and parties",
            popular: true
        },
        {
            id: 4,
            name: "Bridal Hair Styling",
            category: "hair",
            price: 3000,
            duration: "2 hours",
            image: `${BASE_URL}hair-styling.jpg`,
            description: "Beautiful curly hairstyle with decorative accessories"
        },
        {
            id: 5,
            name: "Professional Makeup",
            category: "makeup",
            price: 1500,
            duration: "1 hour",
            image: `${BASE_URL}makeup-service.jpg`,
            description: "Professional makeup application for any occasion"
        },
        {
            id: 6,
            name: "Mehndi Application",
            category: "bridal",
            price: 2000,
            duration: "2 hours",
            image: `${BASE_URL}bridal-complete.jpg`,
            description: "Traditional and modern mehndi designs for brides"
        },
        {
            id: 7,
            name: "Bridal Portrait Makeup",
            category: "bridal",
            price: 5000,
            duration: "2 hours",
            image: `${BASE_URL}bridal-makeup-portrait.jpg`,
            description: "Elegant bridal portrait makeup with stunning jewelry styling",
            popular: true
        },
        {
            id: 8,
            name: "Curly Bridal Hairstyle",
            category: "hair",
            price: 3500,
            duration: "2.5 hours",
            image: `${BASE_URL}bridal-hairstyle-curls.jpg`,
            description: "Gorgeous curly hairstyle with floral accessories for brides"
        }
    ];

    const filteredServices = activeCategory === 'all'
        ? services
        : services.filter(s => s.category === activeCategory);

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

    return (
        <section
            id="services"
            ref={sectionRef}
            className={`py-24 relative overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-pink-50/50 to-white'}`}
        >
            {/* Background Decorations */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-0 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="inline-flex items-center space-x-2 mb-4">
                        <div className="h-px w-8 bg-gradient-to-r from-transparent to-pink-500" />
                        <span className={`text-sm font-medium tracking-widest uppercase ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                            Our Services
                        </span>
                        <div className="h-px w-8 bg-gradient-to-l from-transparent to-pink-500" />
                    </div>

                    <h2 className={`text-4xl md:text-5xl font-display font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Premium Beauty{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                            Services
                        </span>
                    </h2>

                    <p className={`max-w-2xl mx-auto text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Choose from our wide range of professional beauty services,
                        each designed to enhance your natural beauty and leave you feeling refreshed.
                    </p>
                </div>

                {/* Category Tabs */}
                <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeCategory === category.id
                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30'
                                : isDarkMode
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                                    : 'bg-white text-gray-600 hover:bg-pink-50 hover:text-pink-600 shadow-md'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredServices.map((service, index) => (
                        <div
                            key={service.id}
                            className={`group relative rounded-2xl overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                } ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl hover:shadow-2xl`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            {/* Popular Badge */}
                            {service.popular && (
                                <div className="absolute top-4 left-4 z-10 flex items-center space-x-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                    <Sparkles className="w-3 h-3" />
                                    <span>Popular</span>
                                </div>
                            )}

                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={service.image}
                                    alt={service.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Quick Book Button */}
                                <button
                                    onClick={() => onBookService(service.name)}
                                    className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 
                           bg-white text-pink-600 px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 
                           hover:bg-pink-600 hover:text-white flex items-center space-x-2"
                                >
                                    <span>Book Now</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className={`text-lg font-bold mb-2 group-hover:text-pink-500 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    {service.name}
                                </h3>

                                <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {service.description}
                                </p>

                                {/* Duration Only */}
                                <div className="flex items-center justify-center">
                                    <div className={`flex items-center space-x-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        <Clock className="w-4 h-4" />
                                        <span>{service.duration}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className={`text-center mt-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <button
                        onClick={() => onBookService()}
                        className="group inline-flex items-center space-x-3 bg-transparent border-2 border-pink-500 text-pink-500 px-8 py-4 rounded-full font-semibold 
                     transition-all duration-300 hover:bg-pink-500 hover:text-white hover:shadow-lg hover:shadow-pink-500/30"
                    >
                        <span>View All Services & Book</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ServicesShowcase;
