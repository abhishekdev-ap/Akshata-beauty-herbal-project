import { useEffect, useState, useRef } from 'react';
import { ChevronDown, Calendar, Star, Award, Sparkles, Heart } from 'lucide-react';

interface HeroSectionProps {
    isDarkMode: boolean;
    onBookNow: () => void;
}

const HeroSection = ({ onBookNow }: HeroSectionProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    // Video playlist - all 3 play in sequence, then loop
    const videoSources = [
        'parlor-makeup.mp4',
        'lipstick.mp4',
        'Bridal.mp4'
    ];

    const slides = [
        {
            title: "Unleash Your",
            highlight: "Inner Beauty",
            subtitle: "Experience premium beauty services that transform and rejuvenate",
        },
        {
            title: "Bridal",
            highlight: "Elegance",
            subtitle: "Make your special day unforgettable with our expert bridal services",
        },
        {
            title: "Professional",
            highlight: "Hair Care",
            subtitle: "From trendy cuts to stunning colors, transform your look today",
        }
    ];

    // Handle video ended event - switch to next video
    const handleVideoEnded = (index: number) => {
        if (index === currentVideoIndex) {
            const nextIndex = (currentVideoIndex + 1) % videoSources.length;
            setCurrentVideoIndex(nextIndex);
        }
    };

    // Preload and prepare next video when current is 50% through
    useEffect(() => {
        const currentVideo = videoRefs.current[currentVideoIndex];
        if (currentVideo) {
            const handleTimeUpdate = () => {
                const nextIndex = (currentVideoIndex + 1) % videoSources.length;
                const nextVideo = videoRefs.current[nextIndex];

                // At 50% through - start loading next video
                if (currentVideo.duration && currentVideo.currentTime > currentVideo.duration * 0.5) {
                    if (nextVideo && nextVideo.preload === 'none') {
                        nextVideo.preload = 'auto';
                        nextVideo.load();
                    }
                }

                // At 95% through - prepare next video for instant play
                if (currentVideo.duration && currentVideo.currentTime > currentVideo.duration * 0.95) {
                    if (nextVideo && nextVideo.paused) {
                        nextVideo.currentTime = 0;
                        // Prime the video by starting it (will be hidden by opacity)
                        nextVideo.play().catch(() => { });
                    }
                }
            };
            currentVideo.addEventListener('timeupdate', handleTimeUpdate);
            return () => currentVideo.removeEventListener('timeupdate', handleTimeUpdate);
        }
    }, [currentVideoIndex, videoSources.length]);

    // Play current video, pause others (except when priming next)
    useEffect(() => {
        videoRefs.current.forEach((video, index) => {
            if (video) {
                if (index === currentVideoIndex) {
                    video.currentTime = 0;
                    video.play().catch(err => {
                        console.log('Autoplay blocked:', err);
                    });
                } else {
                    // Don't immediately pause - let the transition happen smoothly
                    setTimeout(() => {
                        if (index !== currentVideoIndex) {
                            video.pause();
                            video.currentTime = 0;
                        }
                    }, 600); // Pause after transition completes
                }
            }
        });
    }, [currentVideoIndex]);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const scrollToNext = () => {
        const aboutSection = document.querySelector('#about');
        aboutSection?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
                {videoSources.map((src, index) => (
                    <video
                        key={src}
                        ref={(el) => { videoRefs.current[index] = el; }}
                        src={src}
                        autoPlay={index === 0}
                        muted
                        playsInline
                        preload={index === 0 ? "auto" : "none"}
                        onEnded={() => handleVideoEnded(index)}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        style={{
                            minHeight: '100vh',
                            minWidth: '100vw',
                            opacity: currentVideoIndex === index ? 1 : 0,
                            transition: 'opacity 0.8s ease-in-out',
                            zIndex: currentVideoIndex === index ? 2 : 1
                        }}
                    />
                ))}
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent z-10" />

            {/* Decorative Elements */}
            <div className="hidden lg:block absolute top-20 left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl z-10" />
            <div className="hidden lg:block absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl z-10" />

            {/* Content */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                        {/* Badge */}
                        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                            <Sparkles className="w-4 h-4 text-pink-400" />
                            <span className="text-white text-sm font-medium">Premium Beauty & Bridal Services</span>
                        </div>

                        {/* Dynamic Headline */}
                        <div className="relative h-32 md:h-40">
                            {slides.map((slide, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-all duration-700 ${currentSlide === index
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-8'
                                        }`}
                                >
                                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight">
                                        {slide.title}
                                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 animate-gradient">
                                            {slide.highlight}
                                        </span>
                                    </h1>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-gray-200 max-w-xl leading-relaxed">
                            {slides[currentSlide].subtitle}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={onBookNow}
                                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/30"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <Calendar className="w-5 h-5 mr-2 relative z-10" />
                                <span className="relative z-10">Book Appointment</span>
                            </button>

                            <button
                                onClick={() => window.open('https://wa.me/919740303404?text=Hi%20Akshata%20Beauty%20Parlour!%20I%20would%20like%20to%20book%20an%20appointment.', '_blank')}
                                className="inline-flex items-center justify-center px-8 py-4 bg-[#25D366] text-white font-semibold rounded-full hover:bg-[#128C7E] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                <span>WhatsApp Chat</span>
                            </button>

                            <button
                                onClick={scrollToNext}
                                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300"
                            >
                                Explore Services
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                            <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                    <Award className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-xl md:text-2xl font-bold text-white leading-none">9+</p>
                                    <p className="text-gray-300 text-xs md:text-sm mt-1">Years Experience</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                                    <Star className="w-5 h-5 md:w-6 md:h-6 text-white fill-current" />
                                </div>
                                <div>
                                    <p className="text-xl md:text-2xl font-bold text-white leading-none">2000+</p>
                                    <p className="text-gray-300 text-xs md:text-sm mt-1">Happy Clients</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                                    <Heart className="w-5 h-5 md:w-6 md:h-6 text-white fill-current" />
                                </div>
                                <div>
                                    <p className="text-xl md:text-2xl font-bold text-white leading-none">100%</p>
                                    <p className="text-gray-300 text-xs md:text-sm mt-1">Satisfaction</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visual Side */}
                    <div className={`hidden lg:block relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        <div className="absolute top-10 right-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 animate-float">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <Award className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">Expert Team</p>
                                    <p className="text-gray-400 text-sm">Trained professionals</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video indicator */}
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
                {videoSources.map((_, index) => (
                    <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${currentVideoIndex === index
                            ? 'bg-pink-500 w-6'
                            : 'bg-white/50'
                            }`}
                    />
                ))}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-0 right-0 w-full flex justify-center z-30">
                <button
                    onClick={scrollToNext}
                    className="text-white animate-bounce"
                >
                    <ChevronDown className="w-8 h-8" />
                </button>
            </div>
        </section>
    );
};

export default HeroSection;
