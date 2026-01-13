import React, { useRef, useEffect, useState } from 'react';
import { useInViewport } from '../hooks/useScrollAnimation';

interface ScrollRevealProps {
    children: React.ReactNode;
    variant?: 'aurora' | 'magnetic' | 'elastic' | 'crystalize' | 'hologram' | 'portal' | 'levitate' | 'emerge';
    delay?: number;
    duration?: number;
    className?: string;
    threshold?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    variant = 'aurora',
    delay = 0,
    duration = 700,
    className = '',
    threshold = 0.12
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const { isInView, progress } = useInViewport(ref, { threshold });
    const [, setIsMobile] = useState(true);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const getAnimatedStyles = (): React.CSSProperties => {
        // Ultra-smooth silk easing - very gentle curve
        const easing = 'cubic-bezier(0.25, 0.1, 0.25, 1)';
        const baseTransition = `all ${duration * 1.5}ms ${easing} ${delay}ms`;

        // Very fast reveal for readability
        const p = Math.min(1, Math.max(0, progress * 3));
        let opacity = isInView ? Math.min(1, 0.85 + (p * 0.15)) : 0.7;
        let transform = '';
        let boxShadow = '';
        let filter = '';

        switch (variant) {
            case 'aurora':
                // ✨ AURORA RISE - Subtle color-shifting glow as content rises
                const auroraY = isInView ? (1 - p) * 35 : 45;
                const auroraScale = 0.97 + (p * 0.03);
                const hue = 330 + (p * 30); // Pink to purple shift
                const glowIntensity = p * 0.25;
                transform = `translateY(${auroraY}px) scale(${auroraScale})`;
                boxShadow = isInView
                    ? `0 ${p * 8}px ${p * 20}px hsla(${hue}, 80%, 60%, ${glowIntensity}), 
                       0 ${p * 15}px ${p * 50}px hsla(${hue + 20}, 70%, 50%, ${glowIntensity * 0.5})`
                    : 'none';
                break;

            case 'magnetic':
                // 🧲 MAGNETIC PULL - Content pulled into view with acceleration
                const magneticEase = Math.pow(p, 0.6); // Accelerating curve
                const magneticY = isInView ? (1 - magneticEase) * 50 : 60;
                const magneticScale = 0.94 + (magneticEase * 0.06);
                const magneticBlur = (1 - p) * 2;
                transform = `translateY(${magneticY}px) scale(${magneticScale})`;
                filter = `blur(${magneticBlur}px)`;
                boxShadow = isInView ? `0 ${magneticEase * 20}px ${magneticEase * 40}px rgba(236, 72, 153, ${magneticEase * 0.12})` : 'none';
                break;

            case 'elastic':
                // 🎯 ELASTIC SPRING - Bouncy physics on vertical axis
                const bounce = Math.sin(p * Math.PI * 1.2) * (1 - p) * 8;
                const elasticY = isInView ? (1 - p) * 40 - bounce : 50;
                const elasticScale = 0.96 + (p * 0.04) + (Math.sin(p * Math.PI) * 0.01);
                transform = `translateY(${elasticY}px) scale(${elasticScale})`;
                boxShadow = isInView ? `0 ${p * 12}px ${p * 30}px rgba(0, 0, 0, ${p * 0.08})` : 'none';
                break;

            case 'crystalize':
                // 💎 CRYSTALIZE - Sharp clarity emerging from softness
                const crystalY = isInView ? (1 - p) * 30 : 40;
                const crystalBlur = (1 - p) * 4;
                const crystalBrightness = 0.9 + (p * 0.1);
                const crystalContrast = 0.95 + (p * 0.05);
                transform = `translateY(${crystalY}px)`;
                filter = `blur(${crystalBlur}px) brightness(${crystalBrightness}) contrast(${crystalContrast})`;
                boxShadow = isInView ? `0 0 ${p * 30}px rgba(255, 255, 255, ${p * 0.3})` : 'none';
                break;

            case 'hologram':
                // 🌈 HOLOGRAM - Futuristic scan-line reveal effect
                const holoY = isInView ? (1 - p) * 35 : 45;
                const holoScale = 0.98 + (p * 0.02);
                const holoHue = p * 60; // Color shift during reveal
                transform = `translateY(${holoY}px) scale(${holoScale})`;
                boxShadow = isInView
                    ? `0 0 ${p * 20}px rgba(236, 72, 153, ${p * 0.2}),
                       inset 0 ${(1 - p) * 100}% 0 rgba(255,255,255, ${(1 - p) * 0.1})`
                    : 'none';
                filter = `hue-rotate(${holoHue}deg) saturate(${1 + p * 0.1})`;
                break;

            case 'portal':
                // 🌀 PORTAL - Emerging from depth with vortex effect
                const portalY = isInView ? (1 - p) * 45 : 60;
                const portalZ = isInView ? (1 - p) * -80 : -100;
                const portalScale = 0.85 + (p * 0.15);
                const portalRotate = isInView ? (1 - p) * 5 : 8; // Very subtle rotation
                transform = `perspective(1000px) translateY(${portalY}px) translateZ(${portalZ}px) scale(${portalScale}) rotateX(${portalRotate}deg)`;
                boxShadow = isInView
                    ? `0 ${p * 15}px ${p * 40}px rgba(147, 51, 234, ${p * 0.15}),
                       0 ${p * 5}px ${p * 15}px rgba(236, 72, 153, ${p * 0.1})`
                    : 'none';
                break;

            case 'levitate':
                // 🎈 LEVITATE - Floating up with gentle oscillation
                const levitateBase = isInView ? (1 - p) * 40 : 55;
                const levitateWobble = Math.sin(p * Math.PI * 2) * 3 * (1 - p);
                const levitateY = levitateBase + levitateWobble;
                const levitateScale = 0.95 + (p * 0.05);
                const levitateRotate = Math.sin(p * Math.PI) * 1; // Tiny tilt
                transform = `translateY(${levitateY}px) scale(${levitateScale}) rotate(${levitateRotate}deg)`;
                boxShadow = isInView
                    ? `0 ${20 + (1 - p) * 20}px ${30 + (1 - p) * 20}px rgba(0, 0, 0, ${0.1 - (p * 0.05)})`
                    : 'none';
                break;

            case 'emerge':
                // 🌊 EMERGE - Rising from below with wave-like motion
                const emergeY = isInView ? (1 - p) * 50 : 65;
                const emergeScale = 0.92 + (p * 0.08);
                const emergeClip = isInView ? 100 : 100 - (p * 100); // Clip path reveal
                transform = `translateY(${emergeY}px) scale(${emergeScale})`;
                boxShadow = isInView
                    ? `0 ${p * 10}px ${p * 25}px rgba(236, 72, 153, ${p * 0.1}),
                       0 -${(1 - p) * 5}px ${(1 - p) * 15}px rgba(255, 255, 255, ${(1 - p) * 0.3})`
                    : 'none';
                break;

            default:
                transform = `translateY(${isInView ? (1 - p) * 30 : 40}px)`;
        }

        // Force full visibility at 60% progress
        if (isInView && p >= 0.6) {
            opacity = 1;
            filter = filter.replace(/blur\([^)]+\)/, 'blur(0px)');
        }

        return {
            opacity,
            transform,
            boxShadow,
            filter,
            transition: baseTransition,
            willChange: 'opacity, transform, filter',
            transformStyle: 'preserve-3d' as const
        };
    };

    return (
        <div ref={ref} className={className} style={getAnimatedStyles()}>
            {children}
        </div>
    );
};

export default ScrollReveal;
