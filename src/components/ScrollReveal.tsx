import React, { useRef } from 'react';
import { useInViewport } from '../hooks/useScrollAnimation';

interface ScrollRevealProps {
    children: React.ReactNode;
    variant?: 'fade' | 'parallax' | 'scale' | 'blur' | 'slide-up' | 'slide-left' | 'slide-right';
    delay?: number;
    duration?: number;
    className?: string;
    threshold?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    variant = 'fade',
    delay = 0,
    duration = 800, // Slightly longer default for smoothness
    className = '',
    threshold = 0.1
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const { isInView, progress } = useInViewport(ref, { threshold });

    // Calculate dynamic styles based on scroll progress and variant
    const getAnimatedStyles = (): React.CSSProperties => {
        const baseTransition = `opacity ${duration}ms cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}ms, filter ${duration}ms cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}ms`;

        // Create an accelerated progress that reaches 1.0 much earlier (at 35% through the viewport)
        // This ensures elements are fully visible/clear when they are in the main reading area
        const revealProgress = Math.min(1, Math.max(0, progress * 3)); // Reaches 1.0 at progress ~0.33

        let opacity = isInView ? Math.min(1, 0.1 + (revealProgress * 0.9)) : 0;
        let transform = '';
        let filter = '';

        switch (variant) {
            case 'parallax':
                // Parallax can stay continuous across the whole transit for smooth movement
                const parallaxY = (0.5 - progress) * 50;
                transform = `translateY(${parallaxY}px)`;
                // But opacity should still clear up relatively quickly
                opacity = isInView ? Math.min(1, 0.4 + (revealProgress * 0.6)) : 0;
                break;

            case 'scale':
                // Scale from 0.9 to 1, saturating earlier
                const scale = 0.9 + (revealProgress * 0.1);
                transform = isInView ? `scale(${Math.min(1, scale)})` : 'scale(0.9)';
                break;

            case 'blur':
                // Blur should clear up completely as soon as it's revealed
                const blurAmount = Math.max(0, (1 - revealProgress) * 10);
                filter = `blur(${isInView ? blurAmount : 10}px)`;
                transform = isInView ? `translateY(${(1 - revealProgress) * 20}px)` : 'translateY(20px)';
                break;

            case 'slide-up':
                const slideUpY = isInView ? (1 - revealProgress) * 30 : 60;
                transform = `translateY(${slideUpY}px)`;
                break;

            case 'slide-left': {
                const slideLeftX = isInView ? (1 - revealProgress) * 30 : 60;
                transform = `translateX(-${slideLeftX}px)`;
                break;
            }

            case 'slide-right': {
                const slideRightX = isInView ? (1 - revealProgress) * 30 : 60;
                transform = `translateX(${slideRightX}px)`;
                break;
            }

            case 'fade':
            default:
                // Simple fade with slight lift
                transform = isInView ? `translateY(${(1 - revealProgress) * 20}px)` : 'translateY(30px)';
                break;
        }

        // Force full opacity once sufficiently revealed to avoid "ghosting"
        if (isInView && revealProgress >= 0.9) {
            opacity = 1;
        }

        return {
            opacity,
            transform,
            filter,
            transition: baseTransition,
            willChange: 'opacity, transform, filter'
        };
    };

    return (
        <div
            ref={ref}
            className={className}
            style={getAnimatedStyles()}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
