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
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={`min-h-screen overflow-x-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <PremiumNavbar
                isDarkMode={isDarkMode}
                onToggleDarkMode={onToggleDarkMode}
                onBookNow={onBookNow}
                onAdminDashboard={onAdminDashboard}
                onLogout={onLogout}
                isUserAdmin={isUserAdmin}
            />

            <HeroSection isDarkMode={isDarkMode} onBookNow={onBookNow} />

            {/* ✨ AURORA - Color-shifting glow rise */}
            <ScrollReveal variant="aurora" duration={700}>
                <FeaturesSection isDarkMode={isDarkMode} />
            </ScrollReveal>

            {/* 🌀 PORTAL - 3D depth emerge */}
            <ScrollReveal variant="portal" delay={30} duration={750}>
                <AboutSection isDarkMode={isDarkMode} />
            </ScrollReveal>

            {/* 🧲 MAGNETIC - Accelerating pull */}
            <ScrollReveal variant="magnetic" duration={650}>
                <ServicesShowcase isDarkMode={isDarkMode} onBookService={onBookNow} />
            </ScrollReveal>

            {/* 🎯 ELASTIC - Bouncy spring */}
            <ScrollReveal variant="elastic" delay={30} duration={700}>
                <StatsCounter isDarkMode={isDarkMode} />
            </ScrollReveal>

            {/* 💎 CRYSTALIZE - Sharp clarity emerge */}
            <ScrollReveal variant="crystalize" duration={650}>
                <GallerySection isDarkMode={isDarkMode} />
            </ScrollReveal>

            {/* 🎈 LEVITATE - Floating rise */}
            <ScrollReveal variant="levitate" delay={30} duration={700}>
                <TestimonialsSection isDarkMode={isDarkMode} />
            </ScrollReveal>

            {/* 🌈 HOLOGRAM - Futuristic reveal */}
            <ScrollReveal variant="hologram" duration={650}>
                <ContactSection isDarkMode={isDarkMode} />
            </ScrollReveal>

            {/* 🌊 EMERGE - Wave rise */}
            <ScrollReveal variant="emerge" delay={30} duration={600}>
                <FooterSection isDarkMode={isDarkMode} />
            </ScrollReveal>
        </div>
    );
};

export default HomePage;
