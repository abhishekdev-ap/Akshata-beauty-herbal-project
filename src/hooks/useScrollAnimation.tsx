import { useEffect, useState, useRef, RefObject, ReactNode, useCallback } from 'react';

// ============================================
// REPLIT-STYLE SCROLL ANIMATIONS
// Optimized for mobile performance
// ============================================

// Utility: Detect mobile device for performance optimizations
export const isMobileDevice = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768 || 'ontouchstart' in window;
};

// Utility: requestAnimationFrame throttle for scroll handlers
const useRAFThrottle = (callback: () => void) => {
    const rafRef = useRef<number | null>(null);
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    return useCallback(() => {
        if (rafRef.current !== null) return;

        rafRef.current = requestAnimationFrame(() => {
            savedCallback.current();
            rafRef.current = null;
        });
    }, []);
};

// Hook for scroll progress within a section
export const useSectionProgress = (ref: RefObject<HTMLElement>): number => {
    const [progress, setProgress] = useState(0);

    const handleScroll = useCallback(() => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionHeight = rect.height;

        // Calculate how much of the section is visible
        const start = rect.top;
        const end = rect.bottom - windowHeight;

        if (start > windowHeight) {
            setProgress(0);
        } else if (end < 0) {
            setProgress(1);
        } else {
            const scrolled = windowHeight - start;
            const total = sectionHeight;
            setProgress(Math.min(1, Math.max(0, scrolled / total)));
        }
    }, [ref]);

    const throttledScroll = useRAFThrottle(handleScroll);

    useEffect(() => {
        window.addEventListener('scroll', throttledScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', throttledScroll);
    }, [throttledScroll, handleScroll]);

    return progress;
};

// Hook for parallax movement based on scroll (optimized for mobile)
export const useParallaxScroll = (speed: number = 0.5): { y: number; opacity: number } => {
    const [values, setValues] = useState({ y: 0, opacity: 1 });
    const isMobile = isMobileDevice();

    const handleScroll = useCallback(() => {
        // Reduce parallax effect on mobile for performance
        const effectiveSpeed = isMobile ? speed * 0.5 : speed;
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Parallax Y movement
        const y = scrollY * effectiveSpeed;

        // Fade out as user scrolls down
        const opacity = Math.max(0, 1 - (scrollY / windowHeight) * 0.5);

        setValues({ y, opacity });
    }, [speed, isMobile]);

    const throttledScroll = useRAFThrottle(handleScroll);

    useEffect(() => {
        window.addEventListener('scroll', throttledScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', throttledScroll);
    }, [throttledScroll, handleScroll]);

    return values;
};

// Hook for detecting scroll direction (optimized with RAF throttling)
export const useScrollDirection = (): 'up' | 'down' | null => {
    const [direction, setDirection] = useState<'up' | 'down' | null>(null);
    const prevScrollY = useRef(0);

    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > prevScrollY.current) {
            setDirection('down');
        } else if (currentScrollY < prevScrollY.current) {
            setDirection('up');
        }

        prevScrollY.current = currentScrollY;
    }, []);

    const throttledScroll = useRAFThrottle(handleScroll);

    useEffect(() => {
        window.addEventListener('scroll', throttledScroll, { passive: true });
        return () => window.removeEventListener('scroll', throttledScroll);
    }, [throttledScroll]);

    return direction;
};

// Hook for element visibility with smooth transitions
export const useInViewport = (
    ref: RefObject<HTMLElement>,
    options: { threshold?: number; rootMargin?: string } = {}
): { isInView: boolean; progress: number } => {
    const [state, setState] = useState({ isInView: false, progress: 0 });
    const { threshold = 0.1, rootMargin = '-10% 0px' } = options;

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleScroll = () => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Check if element is in viewport
            const isInView = rect.top < windowHeight && rect.bottom > 0;

            // Calculate progress (0 when entering, 1 when fully visible)
            const progress = Math.min(1, Math.max(0,
                (windowHeight - rect.top) / (windowHeight + rect.height)
            ));

            setState({ isInView, progress });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [ref, threshold, rootMargin]);

    return state;
};

// Replit-style scroll section props
interface ReplitScrollSectionProps {
    children: ReactNode;
    className?: string;
    parallaxSpeed?: number;
    fadeOnScroll?: boolean;
    scaleOnScroll?: boolean;
    blurOnScroll?: boolean;
}

// Component for Replit-style scroll animations
export const ReplitScrollSection = ({
    children,
    className = '',
    parallaxSpeed = 0,
    fadeOnScroll = true,
    scaleOnScroll = false,
    blurOnScroll = false
}: ReplitScrollSectionProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { isInView, progress } = useInViewport(ref);

    // Calculate animation values based on scroll progress
    const opacity = fadeOnScroll ? 0.3 + (progress * 0.7) : 1;
    const scale = scaleOnScroll ? 0.9 + (progress * 0.1) : 1;
    const blur = blurOnScroll ? (1 - progress) * 5 : 0;
    const translateY = parallaxSpeed ? (1 - progress) * parallaxSpeed * 100 : 0;

    return (
        <div
            ref={ref}
            className={`replit-scroll-section ${className}`
            }
            style={{
                opacity: isInView ? opacity : 0.3,
                transform: `translateY(${translateY}px) scale(${scale})`,
                filter: `blur(${blur}px)`,
                transition: 'opacity 0.4s ease-out, transform 0.4s ease-out, filter 0.4s ease-out',
            }}
        >
            {children}
        </div>
    );
};

// Sticky scroll container like Replit
interface StickyScrollProps {
    children: ReactNode;
    className?: string;
    height?: string;
}

export const StickyScrollContainer = ({
    children,
    className = '',
    height = '200vh'
}: StickyScrollProps) => {
    return (
        <div className={`sticky-scroll-container ${className}`
        } style={{ height }}>
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden" >
                {children}
            </div>
        </div>
    );
};

// Horizontal scroll on vertical scroll (like Replit features)
export const useHorizontalScroll = (ref: RefObject<HTMLElement>, multiplier: number = 1) => {
    const [translateX, setTranslateX] = useState(0);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleScroll = () => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementHeight = rect.height;

            // Calculate scroll progress within the element
            const start = windowHeight;
            const scrollProgress = (start - rect.top) / (elementHeight + windowHeight);

            // Convert to horizontal translation
            const maxTranslate = element.scrollWidth - element.clientWidth;
            const translate = Math.min(maxTranslate, Math.max(0, scrollProgress * maxTranslate * multiplier));

            setTranslateX(-translate);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [ref, multiplier]);

    return translateX;
};

export default ReplitScrollSection;
