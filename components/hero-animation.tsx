'use client';

import { motion, useAnimation, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface HeroAnimationProps {
  children: React.ReactNode;
}

export function HeroAnimation({ children }: HeroAnimationProps) {
  const [phase, setPhase] = useState(0);
  const controls = useAnimation();
  
  // Mouse tracking for teal glow effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics for delayed chase effect
  const springConfig = { damping: 25, stiffness: 150, mass: 1 };
  const glowX = useSpring(mouseX, springConfig);
  const glowY = useSpring(mouseY, springConfig);
  
  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Check if mobile (disable on touch devices)
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion || isMobile) return;
      
      // Calculate offset from center of viewport
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Limit the movement range (subtle effect)
      const offsetX = (e.clientX - centerX) * 0.08;
      const offsetY = (e.clientY - centerY) * 0.08;
      
      mouseX.set(offsetX);
      mouseY.set(offsetY);
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY, prefersReducedMotion, isMobile]);

  useEffect(() => {
    // Phase 1: Dark Ambient Intro (0-1s)
    // Phase 2: Logo Fade Into Existence (1-3s)
    // Phase 3: Torch Ignition (3-4s)
    // Phase 4: Ambient Lighting (4-5s)
    // Phase 5: Idle State (5s+)
    
    const timer1 = setTimeout(() => setPhase(1), 400);
    const timer2 = setTimeout(() => setPhase(2), 1150);
    const timer3 = setTimeout(() => setPhase(3), 1700);
    const timer4 = setTimeout(() => setPhase(4), 2300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="relative min-h-[100svh] flex flex-col items-center overflow-hidden">
      {/* Phase 1-4: Cinematic Dark Background - Hero Section */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #000000 0%, #000000 40%, #0D0B09 55%, #1E1714 70%, #241B18 85%, #2A1F1A 100%)',
        }}
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      {/* Phase 1-5: Cinematic Teal Ambient Overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        style={{
          background: 'radial-gradient(ellipse at 50% 35%, rgba(30, 107, 115, 0.12) 0%, rgba(30, 107, 115, 0.04) 40%, transparent 65%)',
        }}
      />

      {/* Phase 2-4: Warm Ember Particles */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 2 ? 0.5 : 0 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        {/* Floating ember particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: (i % 3) + 1,
              height: (i % 3) + 1,
              background: 'radial-gradient(circle, rgba(200, 164, 107, 0.5) 0%, transparent 70%)',
              left: `${15 + i * 10}%`,
              top: `${25 + (i % 4) * 15}%`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 5 + i * 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.6,
            }}
          />
        ))}
      </motion.div>

      {/* Phase 3-4: Torch Ignition Glow Layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 3 ? 1 : 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        {/* Central teal flame glow behind logo */}
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(30, 107, 115, 0.18) 0%, rgba(30, 107, 115, 0.06) 40%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        
        {/* Warm bronze edge lighting */}
        <div 
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139, 94, 60, 0.12) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Soft gold highlight */}
        <div 
          className="absolute top-1/4 right-1/3 w-[200px] h-[200px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(200, 164, 107, 0.12) 0%, transparent 50%)',
            filter: 'blur(30px)',
          }}
        />
      </motion.div>

      {/* Phase 5: Continuous Idle Glow Animation */}
      {phase >= 4 && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div 
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(30, 107, 115, 0.1) 0%, transparent 60%)',
              filter: 'blur(50px)',
            }}
          />
        </motion.div>
      )}

      {/* Logo Container with All Phases */}
      <div className="relative z-10 flex flex-col items-center w-full pt-16 sm:pt-20">
        {/* Phase 2: Logo Fade Into Existence */}
        <motion.div
          className="relative flex justify-center w-full"
          initial={{ 
            opacity: 0, 
            y: 20,
            scale: 0.97,
          }}
          animate={{
            opacity: phase >= 2 ? 1 : 0,
            y: phase >= 2 ? 0 : 20,
            scale: phase >= 2 ? 1 : 0.97,
          }}
          style={{ willChange: 'transform, opacity' }}
          transition={{
            duration: 1.1,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {/* Phase 3-5: Torch Glow Behind Logo with Mouse Tracking */}
          <motion.div
            className="absolute inset-0 -m-8 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: phase >= 3 ? 1 : 0,
            }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            {/* Inner flame glow with mouse tracking */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full"
              animate={phase >= 4 ? {
                scale: [1, 1.05, 1],
                opacity: [0.4, 0.6, 0.4],
              } : {}}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                background: 'radial-gradient(circle, rgba(30, 107, 115, 0.3) 0%, rgba(61, 133, 139, 0.1) 40%, transparent 70%)',
                filter: 'blur(20px)',
                x: glowX,
                y: glowY,
                willChange: 'transform',
              }}
            />
          </motion.div>

          {/* Logo Image - 10% larger */}
          <div
            className="relative mx-auto mt-0 mb-3"
            style={{
              width: 'clamp(242px, 31vw, 352px)',
              aspectRatio: '1024 / 1536',
            }}
          >
            <Image
              src="/forged-logo.png"
              alt="Forged in the Fire — Empowering Survivors of Sex Trafficking"
              fill
              sizes="(max-width: 640px) 72vw, (max-width: 1024px) 50vw, 340px"
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </motion.div>

        {/* Children (Headline, Subheadline, CTAs) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </div>

      {/* Phase 4: Ambient Light Spread - Warm safety glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 4 ? 1 : 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{
          background: 'linear-gradient(to top, rgba(139, 94, 60, 0.08) 0%, transparent 100%)',
        }}
      />
    </div>
  );
}
