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
      {/* Phase 1-4: Background Transition - Dark to Warm */}
      <motion.div
        className="absolute inset-0"
        initial={{ backgroundColor: '#141414' }}
        animate={{
          backgroundColor: phase >= 4 ? '#FAF7F2' : phase >= 2 ? '#1F1F1F' : '#141414',
        }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />

      {/* Phase 2-4: Ambient Fog/Embers Layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 2 ? 0.4 : 0 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        {/* Subtle ember particles - floating dots */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              background: 'radial-gradient(circle, rgba(200, 164, 107, 0.6) 0%, transparent 70%)',
              left: `${20 + i * 12}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.div>

      {/* Phase 3-4: Torch Glow Layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 3 ? 1 : 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        {/* Central teal glow behind logo */}
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(30, 107, 115, 0.15) 0%, rgba(30, 107, 115, 0.05) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        
        {/* Warm bronze glow layer */}
        <div 
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139, 94, 60, 0.1) 0%, transparent 60%)',
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
          className="relative"
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
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72">
            <Image
              src="/herologo.png"
              alt="Forged in the Fire"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </motion.div>

        {/* Children (Headline, Subheadline, CTAs) - Phase 4 Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 4 ? 1 : 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        >
          {children}
        </motion.div>
      </div>

      {/* Phase 4: Ambient Light Spread - Bottom gradient */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 4 ? 1 : 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{
          background: 'linear-gradient(to top, rgba(30, 107, 115, 0.05) 0%, transparent 100%)',
        }}
      />
    </div>
  );
}
