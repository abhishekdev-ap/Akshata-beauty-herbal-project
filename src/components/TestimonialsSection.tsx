import { useEffect, useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { mockReviews } from '../data/mockReviews';

interface TestimonialsSectionProps {
    isDarkMode: boolean;
}

const TestimonialsSection = ({ isDarkMode }: TestimonialsSectionProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const sectionRef = useRef<HTMLElement>(null);

    // Get real reviews from mockReviews
    const testimonials = mockReviews.map((review, index) => ({
        id: index + 1,
        name: review.customerName || 'Customer',
        role: 'Customer',
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(review.customerName || 'Customer')}&background=ec4899&color=fff&size=200`,
        rating: review.rating,
        text: review.comment
    }));

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

    useEffect(() => {
        if (!isAutoPlaying || testimonials.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, testimonials.length]);

    const nextTestimonial = () => {
        if (testimonials.length === 0) return;
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        if (testimonials.length === 0) return;
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    // Don't render section if there are no reviews
    if (testimonials.length === 0) {
        return null;
    }

    return (
        <section
            id="testimonials"
            ref={sectionRef}
            className={`py-24 relative overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-pink-50 via-white to-purple-50'}`}
        >
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="inline-flex items-center space-x-2 mb-4">
                        <div className="h-px w-8 bg-gradient-to-r from-transparent to-pink-500" />
                        <span className={`text-sm font-medium tracking-widest uppercase ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                            Testimonials
                        </span>
                        <div className="h-px w-8 bg-gradient-to-l from-transparent to-pink-500" />
                    </div>

                    <h2 className={`text-4xl md:text-5xl font-display font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        What Our{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                            Clients Say
                        </span>
                    </h2>

                    <p className={`max-w-2xl mx-auto text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Real reviews from our valued customers
                    </p>
                </div>

                {/* Testimonial Carousel */}
                <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    {/* Main Testimonial Card */}
                    <div className={`max-w-4xl mx-auto p-8 md:p-12 rounded-3xl relative ${isDarkMode ? 'bg-gray-900' : 'bg-white'
                        } shadow-2xl`}>
                        {/* Quote Icon */}
                        <div className="absolute -top-6 left-8">
                            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                                <Quote className="w-6 h-6 text-white" />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Customer Image */}
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gradient-to-r from-pink-500 to-purple-600 p-1">
                                        <img
                                            src={testimonials[currentIndex].image}
                                            alt={testimonials[currentIndex].name}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                    {/* Decorative ring */}
                                    <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full opacity-20 animate-pulse" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 text-center md:text-left">
                                {/* Rating */}
                                <div className="flex justify-center md:justify-start space-x-1 mb-4">
                                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className={`text-lg md:text-xl leading-relaxed mb-6 italic ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    "{testimonials[currentIndex].text}"
                                </p>

                                {/* Customer Info */}
                                <div>
                                    <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {testimonials[currentIndex].name}
                                    </h4>
                                    <p className="text-pink-500 font-medium">
                                        {testimonials[currentIndex].role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-center items-center mt-8 space-x-4">
                        <button
                            onClick={prevTestimonial}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isDarkMode
                                ? 'bg-gray-700 text-white hover:bg-pink-600'
                                : 'bg-white text-gray-700 hover:bg-pink-500 hover:text-white shadow-lg'
                                }`}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        {/* Dots */}
                        <div className="flex space-x-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setIsAutoPlaying(false);
                                        setCurrentIndex(index);
                                    }}
                                    className={`transition-all duration-300 ${currentIndex === index
                                        ? 'w-8 h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full'
                                        : `w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'}`
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextTestimonial}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isDarkMode
                                ? 'bg-gray-700 text-white hover:bg-pink-600'
                                : 'bg-white text-gray-700 hover:bg-pink-500 hover:text-white shadow-lg'
                                }`}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
