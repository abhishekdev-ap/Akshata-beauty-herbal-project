import { useEffect, useRef, useState } from 'react';
import { Instagram, Mail, Phone } from 'lucide-react';

interface TeamSectionProps {
    isDarkMode: boolean;
}

const TeamSection = ({ isDarkMode }: TeamSectionProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    const team = [
        {
            id: 1,
            name: "Akshata",
            role: "Founder & Chief Stylist",
            image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            bio: "With 10+ years of experience in bridal and beauty services",
            speciality: "Bridal Makeup"
        },
        {
            id: 2,
            name: "Priya Sharma",
            role: "Senior Hair Stylist",
            image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            bio: "Expert in modern hair styling and coloring techniques",
            speciality: "Hair Coloring"
        },
        {
            id: 3,
            name: "Meera Reddy",
            role: "Skin Care Specialist",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            bio: "Certified dermatologist with expertise in facial treatments",
            speciality: "Facial Treatments"
        },
        {
            id: 4,
            name: "Kavya Nair",
            role: "Nail Art Expert",
            image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            bio: "Creative nail artist with international training",
            speciality: "Nail Art"
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

    return (
        <section
            id="team"
            ref={sectionRef}
            className={`py-24 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-white to-pink-50/30'}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="inline-flex items-center space-x-2 mb-4">
                        <div className="h-px w-8 bg-gradient-to-r from-transparent to-pink-500" />
                        <span className={`text-sm font-medium tracking-widest uppercase ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                            Our Team
                        </span>
                        <div className="h-px w-8 bg-gradient-to-l from-transparent to-pink-500" />
                    </div>

                    <h2 className={`text-4xl md:text-5xl font-display font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Meet Our{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                            Expert Team
                        </span>
                    </h2>

                    <p className={`max-w-2xl mx-auto text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Our talented professionals are dedicated to making you look and feel your best
                    </p>
                </div>

                {/* Team Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member, index) => (
                        <div
                            key={member.id}
                            className={`group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <div className={`relative rounded-3xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                                } shadow-xl hover:shadow-2xl transition-all duration-500`}>
                                {/* Image Container */}
                                <div className="relative h-72 overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-pink-600/90 to-purple-600/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center">
                                        {/* Social Links */}
                                        <div className="flex space-x-3 mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-pink-600 transition-all duration-300">
                                                <Instagram className="w-5 h-5" />
                                            </a>
                                            <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-pink-600 transition-all duration-300">
                                                <Mail className="w-5 h-5" />
                                            </a>
                                            <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-pink-600 transition-all duration-300">
                                                <Phone className="w-5 h-5" />
                                            </a>
                                        </div>

                                        {/* Bio */}
                                        <p className="text-white text-center px-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                            {member.bio}
                                        </p>
                                    </div>

                                    {/* Speciality Badge */}
                                    <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                        {member.speciality}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 text-center">
                                    <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {member.name}
                                    </h3>
                                    <p className={`text-pink-500 font-medium ${isDarkMode ? '' : ''}`}>
                                        {member.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;
