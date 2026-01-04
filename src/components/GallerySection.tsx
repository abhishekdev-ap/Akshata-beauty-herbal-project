import { useEffect, useRef, useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

interface GallerySectionProps {
    isDarkMode: boolean;
}

const GallerySection = ({ isDarkMode }: GallerySectionProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const sectionRef = useRef<HTMLElement>(null);

    // Base URL for assets - handles both development and production
    const BASE_URL = import.meta.env.BASE_URL;

    const categories = [
        { id: 'all', name: 'All' },
        { id: 'bridal', name: 'Bridal' },
        { id: 'makeup', name: 'Makeup' },
        { id: 'hair', name: 'Hair' }
    ];

    const galleryItems = [
        {
            id: 1,
            category: 'bridal',
            image: `${BASE_URL}bridal-makeup.jpg`,
            title: 'Bridal Makeup'
        },
        {
            id: 2,
            category: 'bridal',
            image: `${BASE_URL}bridal-complete.jpg`,
            title: 'Complete Bridal Look'
        },
        {
            id: 3,
            category: 'makeup',
            image: `${BASE_URL}party-makeup.jpg`,
            title: 'Party Glam'
        },
        {
            id: 4,
            category: 'hair',
            image: `${BASE_URL}hair-styling.jpg`,
            title: 'Bridal Hairstyle'
        },
        {
            id: 5,
            category: 'makeup',
            image: `${BASE_URL}makeup-service.jpg`,
            title: 'Makeup Application'
        },
        {
            id: 6,
            category: 'bridal',
            image: `${BASE_URL}bridal-makeup-portrait.jpg`,
            title: 'Bridal Portrait'
        },
        {
            id: 7,
            category: 'hair',
            image: `${BASE_URL}bridal-hairstyle-curls.jpg`,
            title: 'Curly Bridal Hairstyle'
        }
    ];

    const filteredItems = activeCategory === 'all'
        ? galleryItems
        : galleryItems.filter(item => item.category === activeCategory);

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
        <>
            <section
                id="gallery"
                ref={sectionRef}
                className={`py-24 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="inline-flex items-center space-x-2 mb-4">
                            <div className="h-px w-8 bg-gradient-to-r from-transparent to-pink-500" />
                            <span className={`text-sm font-medium tracking-widest uppercase ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                                Our Gallery
                            </span>
                            <div className="h-px w-8 bg-gradient-to-l from-transparent to-pink-500" />
                        </div>

                        <h2 className={`text-4xl md:text-5xl font-display font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Our{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                                Masterpieces
                            </span>
                        </h2>

                        <p className={`max-w-2xl mx-auto text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Browse through our portfolio of stunning transformations and beautiful work
                        </p>
                    </div>

                    {/* Category Filters */}
                    <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${activeCategory === category.id
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                                    : isDarkMode
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredItems.map((item, index) => (
                            <div
                                key={item.id}
                                className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                    }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                                onClick={() => setSelectedImage(item.image)}
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                                            <ZoomIn className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-white font-semibold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                                            {item.title}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <img
                        src={selectedImage}
                        alt="Gallery preview"
                        className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
};

export default GallerySection;
