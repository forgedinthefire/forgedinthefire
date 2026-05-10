'use client';

import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface HeroAnimationProps {
  children: React.ReactNode;
}

export function HeroAnimation({ children }: HeroAnimationProps) {
  const [phase, setPhase] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    // Phase 1: Dark Ambient Intro (0-1s)
    // Phase 2: Logo Fade Into Existence (1-3s)
    // Phase 3: Torch Ignition (3-4s)
    // Phase 4: Ambient Lighting (4-5s)
    // Phase 5: Idle State (5s+)
    
    const timer1 = setTimeout(() => setPhase(1), 1000);
    const timer2 = setTimeout(() => setPhase(2), 3000);
    const timer3 = setTimeout(() => setPhase(3), 4000);
    const timer4 = setTimeout(() => setPhase(4), 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Phase 1-4: Cinematic Dark Background - Hero Section */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #1E1714 0%, #241B18 50%, #2A1F1A 100%)',
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
          background: 'radial-gradient(circle at center, rgba(30, 107, 115, 0.14) 0%, rgba(30, 107, 115, 0.04) 45%, transparent 70%)',
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
      <div className="relative z-10 flex flex-col items-center">
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
          transition={{
            duration: 2,
            ease: [0.25, 0.1, 0.25, 1], // Cinematic easing
          }}
        >
          {/* Phase 3-5: Torch Glow Behind Logo */}
          <motion.div
            className="absolute inset-0 -m-8 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: phase >= 3 ? 1 : 0,
            }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            {/* Inner flame glow */}
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
              }}
            />
          </motion.div>

          {/* Logo Image */}
          <div className="relative w-[480px] max-w-[85vw] sm:w-[660px] sm:max-w-[72vw] lg:w-[800px] lg:max-w-[64vw] aspect-square mt-10 mb-10 mx-auto">
            <Image
              src="/herologo.png"
              alt="Forged in the Fire"
              fill
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 72vw, 64vw"
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
