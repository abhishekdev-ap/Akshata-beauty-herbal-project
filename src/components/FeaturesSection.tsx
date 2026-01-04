import { useEffect, useRef, useState } from 'react';
import { Sparkles, Heart, Gem, Crown } from 'lucide-react';

interface FeaturesSectionProps {
    isDarkMode: boolean;
}

const FeaturesSection = ({ isDarkMode }: FeaturesSectionProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    const features = [
        {
            icon: Sparkles,
            title: "Premium Products",
            description: "We use only the finest, internationally acclaimed beauty products to ensure the best results for your skin and hair.",
            color: "from-pink-500 to-rose-500"
        },
        {
            icon: Heart,
            title: "Personalized Care",
            description: "Every treatment is tailored to your unique needs, ensuring you receive the attention and care you deserve.",
            color: "from-purple-500 to-indigo-500"
        },
        {
            icon: Crown,
            title: "Expert Stylists",
            description: "Our team of certified professionals brings years of experience and passion for beauty to every service.",
            color: "from-amber-500 to-orange-500"
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
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className={`py-24 relative overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-white to-pink-50/30'
                }`}
        >
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="inline-flex items-center space-x-2 mb-4">
                        <div className="h-px w-8 bg-gradient-to-r from-transparent to-pink-500" />
                        <span className={`text-sm font-medium tracking-widest uppercase ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                            What We Provide
                        </span>
                        <div className="h-px w-8 bg-gradient-to-l from-transparent to-pink-500" />
                    </div>

                    <h2 className={`text-4xl md:text-5xl font-display font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Exceptional Beauty{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                            Experience
                        </span>
                    </h2>

                    <p className={`max-w-2xl mx-auto text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Discover the perfect blend of luxury and expertise at AKSHATA BEAUTY HERBAL PARLOUR,
                        where beauty meets elegance and every visit becomes a memorable experience.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className={`group relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <div className={`relative p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 ${isDarkMode
                                    ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                                    : 'bg-white hover:bg-white shadow-xl hover:shadow-2xl'
                                }`}>
                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 
                              transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className={`text-xl font-bold mb-4 font-display ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {feature.title}
                                </h3>

                                <p className={`leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {feature.description}
                                </p>

                                {/* Hover Border Effect */}
                                <div className={`absolute inset-0 rounded-3xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${feature.color.includes('pink') ? 'border-pink-500' :
                                        feature.color.includes('purple') ? 'border-purple-500' : 'border-amber-500'
                                    }`} />

                                {/* Decorative Corner */}
                                <div className={`absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity duration-300 ${isDarkMode ? 'bg-white' : 'bg-gradient-to-br from-pink-500 to-purple-600'
                                    } rounded-bl-[100px] rounded-tr-3xl`} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Decorative Element */}
                <div className={`mt-16 flex justify-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex items-center space-x-4">
                        <Gem className={`w-5 h-5 ${isDarkMode ? 'text-pink-400' : 'text-pink-500'}`} />
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Quality • Excellence • Beauty
                        </span>
                        <Gem className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
