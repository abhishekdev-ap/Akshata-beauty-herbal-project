import { useEffect } from 'react';
import PremiumNavbar from './PremiumNavbar';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import AboutSection from './AboutSection';
import ServicesShowcase from './ServicesShowcase';
import StatsCounter from './StatsCounter';
import GallerySection from './GallerySection';
import TestimonialsSection from './TestimonialsSection';
import ContactSection from './ContactSection';
import FooterSection from './FooterSection';
import ScrollReveal from './ScrollReveal';

interface HomePageProps {
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
    onBookNow: () => void;
    onAdminDashboard?: () => void;
    onLogout?: () => void;
    isUserAdmin?: boolean;
}

const HomePage = ({ isDarkMode, onToggleDarkMode, onBookNow, onAdminDashboard, onLogout, isUserAdmin }: HomePageProps) => {
    // Scroll to top when component mounts (when navigating back to home)
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={`min-h-screen overflow-x-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            {/* Navigation */}
            <PremiumNavbar
                isDarkMode={isDarkMode}
                onToggleDarkMode={onToggleDarkMode}
                onBookNow={onBookNow}
                onAdminDashboard={onAdminDashboard}
                onLogout={onLogout}
                isUserAdmin={isUserAdmin}
            />

            {/* Hero Section - No scroll animation needed, it's the first thing visible */}
            <HeroSection isDarkMode={isDarkMode} onBookNow={onBookNow} />

            {/* Features Section - Replit-style fade with parallax feel */}
            <ScrollReveal variant="fade" delay={0} duration={800}>
                <FeaturesSection isDarkMode={isDarkMode} />
            </ScrollReveal>

            {/* About Section - Parallax scroll effect */}
            <ScrollReveal variant="parallax" delay={100}>
                <AboutSection isDarkMode={isDarkMode} />
            </ScrollReveal>

            {/* Services Showcase - Scale animation like Replit cards */}
            <ScrollReveal variant="scale" delay={0} duration={700}>
                <ServicesShowcase isDarkMode={isDarkMode} onBookService={onBookNow} />
            </ScrollReveal>

            {/* Stats Counter - Blur in effect for premium feel */}
            <ScrollReveal variant="blur" delay={100} duration={900}>
                <StatsCounter isDarkMode={isDarkMode} />
            </ScrollReveal>

            {/* Gallery Section - Slide up animation */}
            <ScrollReveal variant="slide-up" delay={0} duration={800}>
                <GallerySection isDarkMode={isDarkMode} />
            </ScrollReveal>

            {/* Testimonials Section - Slide from right */}
            <ScrollReveal variant="slide-right" delay={100} duration={800}>
                <TestimonialsSection isDarkMode={isDarkMode} />
            </ScrollReveal>

            {/* Contact Section - Fade animation */}
            <ScrollReveal variant="fade" delay={0} duration={700}>
                <ContactSection isDarkMode={isDarkMode} />
            </ScrollReveal>

            {/* Footer - Slide up */}
            <ScrollReveal variant="slide-up" delay={100} duration={600}>
                <FooterSection isDarkMode={isDarkMode} />
            </ScrollReveal>
        </div>
    );
};

export default HomePage;
