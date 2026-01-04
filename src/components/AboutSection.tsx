import { useEffect, useRef, useState } from 'react';
import { Award, Users, Heart, CheckCircle, ArrowRight } from 'lucide-react';

interface AboutSectionProps {
    isDarkMode: boolean;
}

const AboutSection = ({ isDarkMode }: AboutSectionProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    const achievements = [
        { icon: Award, value: "9+", label: "Years Experience" },
        { icon: Users, value: "2000+", label: "Happy Clients" },
        { icon: Heart, value: "100%", label: "Satisfaction" }
    ];

    const features = [
        "Expert & Certified Beauticians",
        "Premium International Products",
        "Personalized Beauty Treatments",
        "Relaxing & Hygienic Environment"
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
            id="about"
            ref={sectionRef}
            className={`py-24 relative overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, ${isDarkMode ? 'white' : 'black'} 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Image Side */}
                    <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                        <div className="relative">
                            {/* Main Image */}
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="AKSHATA BEAUTY HERBAL PARLOUR Interior"
                                    className="w-full h-[500px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            </div>

                            {/* Floating Experience Card */}
                            <div className={`absolute -bottom-8 -right-8 p-6 rounded-2xl shadow-xl backdrop-blur-sm ${isDarkMode ? 'bg-gray-900/90 border border-gray-700' : 'bg-white/90'
                                }`}>
                                <div className="text-center">
                                    <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                                        9+
                                    </span>
                                    <p className={`text-sm font-medium mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Years of<br />Excellence
                                    </p>
                                </div>
                            </div>

                            {/* Decorative Element */}
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl -z-10 opacity-50" />
                            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl -z-10 opacity-30" />
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        {/* Section Label */}
                        <div className="inline-flex items-center space-x-2 mb-4">
                            <div className="h-px w-8 bg-gradient-to-r from-transparent to-pink-500" />
                            <span className={`text-sm font-medium tracking-widest uppercase ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                                About Us
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className={`text-4xl md:text-5xl font-display font-bold mb-6 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Where Beauty Meets{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                                Elegance
                            </span>
                        </h2>

                        {/* Description */}
                        <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Welcome to AKSHATA BEAUTY HERBAL PARLOUR, your premier destination for beauty and bridal services.
                            With 9+ years of experience, we have been transforming looks and boosting confidence
                            with our exceptional services and personalized care.
                        </p>

                        <p className={`text-lg leading-relaxed mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Our team of skilled professionals is dedicated to providing you with the latest trends,
                            timeless techniques, and a relaxing experience that leaves you feeling beautiful inside and out.
                        </p>

                        {/* Features List */}
                        <div className="grid sm:grid-cols-2 gap-4 mb-8">
                            {features.map((feature, index) => (
                                <div
                                    key={feature}
                                    className={`flex items-center space-x-3 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                                        }`}
                                    style={{ transitionDelay: `${400 + index * 100}ms` }}
                                >
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <button className="group inline-flex items-center space-x-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold 
                             transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/30 hover:-translate-y-1">
                            <span>Learn More About Us</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                    </div>
                </div>

                {/* Achievement Stats */}
                <div className={`mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    {achievements.map((item) => (
                        <div
                            key={item.label}
                            className={`text-center p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-gray-900/50 hover:bg-gray-900' : 'bg-pink-50/50 hover:bg-pink-50'
                                }`}
                        >
                            <item.icon className={`w-8 h-8 mx-auto mb-3 ${isDarkMode ? 'text-pink-400' : 'text-pink-500'}`} />
                            <p className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {item.value}
                            </p>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {item.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
