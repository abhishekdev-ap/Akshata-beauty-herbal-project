import { useEffect, useRef, useState } from 'react';
import { Award, Users, Smile, Scissors } from 'lucide-react';

interface StatsCounterProps {
    isDarkMode: boolean;
}

const StatsCounter = ({ isDarkMode }: StatsCounterProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [counts, setCounts] = useState({ years: 0, clients: 0, services: 0, experts: 0 });
    const sectionRef = useRef<HTMLElement>(null);
    const hasAnimated = useRef(false);

    const stats = [
        { icon: Award, target: 9, suffix: '+', label: 'Years Experience', key: 'years' },
        { icon: Users, target: 2000, suffix: '+', label: 'Happy Clients', key: 'clients' },
        { icon: Scissors, target: 50, suffix: '+', label: 'Services Offered', key: 'services' },
        { icon: Smile, target: 15, suffix: '+', label: 'Expert Stylists', key: 'experts' }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated.current) {
                        setIsVisible(true);
                        hasAnimated.current = true;
                        animateCounters();
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const animateCounters = () => {
        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;

        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

            setCounts({
                years: Math.floor(9 * easeProgress),
                clients: Math.floor(2000 * easeProgress),
                services: Math.floor(50 * easeProgress),
                experts: Math.floor(15 * easeProgress)
            });

            if (currentStep >= steps) {
                clearInterval(interval);
                setCounts({ years: 9, clients: 2000, services: 50, experts: 15 });
            }
        }, stepDuration);
    };

    return (
        <section
            ref={sectionRef}
            className="relative py-24 overflow-hidden"
        >
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)'
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-pink-900/90 via-purple-900/90 to-indigo-900/90" />

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}
                    />
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                        Our Journey in{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                            Numbers
                        </span>
                    </h2>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        9+ years of excellence in beauty services, trusted by thousands of happy customers
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={stat.key}
                            className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <div className="relative inline-block mb-6">
                                {/* Glowing Background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse" />

                                {/* Icon Container */}
                                <div className="relative w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center 
                              shadow-lg shadow-pink-500/30 transform hover:scale-110 transition-transform duration-300">
                                    <stat.icon className="w-10 h-10 text-white" />
                                </div>
                            </div>

                            {/* Counter */}
                            <div className="mb-2">
                                <span className="text-5xl md:text-6xl font-bold text-white counter-number">
                                    {counts[stat.key as keyof typeof counts].toLocaleString()}
                                </span>
                                <span className="text-3xl md:text-4xl font-bold text-pink-300">
                                    {stat.suffix}
                                </span>
                            </div>

                            {/* Label */}
                            <p className="text-gray-300 font-medium text-lg">
                                {stat.label}
                            </p>

                            {/* Decorative Line */}
                            <div className="mt-4 mx-auto w-12 h-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsCounter;
