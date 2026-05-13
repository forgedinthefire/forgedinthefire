'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const SEQUENCE_TIMING = {
  sparkLine: 0,
  logoIgnition: 1200,
  missionLine: 2800,
  finalTagline: 5200,
  holdDuration: 7500,
};

export function MissionMomentCard() {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase(4);
      setIsComplete(true);
      return;
    }

    const timers: NodeJS.Timeout[] = [];
    
    timers.push(setTimeout(() => setPhase(1), SEQUENCE_TIMING.sparkLine));
    timers.push(setTimeout(() => setPhase(2), SEQUENCE_TIMING.logoIgnition));
    timers.push(setTimeout(() => setPhase(3), SEQUENCE_TIMING.missionLine));
    timers.push(setTimeout(() => {
      setPhase(4);
      setIsComplete(true);
    }, SEQUENCE_TIMING.finalTagline));

    return () => timers.forEach(clearTimeout);
  }, [prefersReducedMotion]);

  // Reduced motion: static final state
  if (prefersReducedMotion) {
    return (
      <ReducedMotionCard />
    );
  }

  return (
    <div 
      className="aspect-square rounded-2xl p-1"
      style={{
        background: 'linear-gradient(135deg, rgba(30,107,115,0.25) 0%, rgba(58,42,36,0.8) 50%, rgba(139,94,60,0.25) 100%)',
      }}
    >
      <div 
        className="w-full h-full rounded-xl flex items-center justify-center relative overflow-hidden"
        style={{
          background: '#241B18',
          boxShadow: '0 20px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(200,164,107,0.1)',
        }}
      >
        {/* Ambient forge glow layers */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(30,107,115,0.15) 0%, transparent 50%)',
          }}
        />
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 2 ? 0.8 : 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{
            background: 'radial-gradient(circle at 70% 70%, rgba(139,94,60,0.12) 0%, transparent 45%)',
          }}
        />

        {/* Central teal fire glow - intensifies with logo */}
        <motion.div
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: phase >= 2 ? 1 : 0,
            scale: phase >= 2 ? 1 : 0.8,
          }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <motion.div
            className="w-48 h-48 rounded-full"
            animate={phase >= 2 ? {
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.1, 1],
            } : {}}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              background: 'radial-gradient(circle, rgba(30,107,115,0.4) 0%, rgba(76,154,163,0.2) 40%, transparent 70%)',
              filter: 'blur(30px)',
            }}
          />
        </motion.div>

        {/* Content container */}
        <div className="text-center p-8 relative z-10 flex flex-col items-center justify-center h-full">
          
          {/* Phase 1: Spark Line */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ 
              opacity: phase >= 1 ? 1 : 0,
              y: phase >= 1 ? 0 : 15,
            }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-serif text-lg italic text-[#C8A46B] mb-8"
          >
            "A spark lit the forge to illuminate the night."
          </motion.p>

          {/* Phase 2: Logo with Ignition Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: phase >= 2 ? 1 : 0,
              scale: phase >= 2 ? 1 : 0.9,
            }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative mb-6"
            style={{ width: '8rem', height: '12rem' }}
          >
            {/* Inner fire glow behind logo */}
            <motion.div
              className="absolute inset-0 -m-6 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 1.5, delay: 0.3 }}
            >
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full"
                animate={phase >= 2 ? {
                  opacity: [0.4, 0.7, 0.4],
                  scale: [0.9, 1.05, 0.9],
                } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  background: 'radial-gradient(circle, rgba(30,107,115,0.5) 0%, rgba(200,164,107,0.2) 50%, transparent 70%)',
                  filter: 'blur(15px)',
                }}
              />
            </motion.div>

            {/* Heart/core glow - subtle pulse */}
            <motion.div
              className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 pointer-events-none"
              animate={phase >= 2 ? {
                opacity: [0.6, 0.9, 0.6],
                scale: [1, 1.15, 1],
              } : { opacity: 0 }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                background: 'radial-gradient(circle, rgba(30,107,115,0.6) 0%, rgba(76,154,163,0.3) 50%, transparent 70%)',
                filter: 'blur(8px)',
              }}
            />

            {/* Logo Image */}
            <motion.div
              animate={isComplete ? {
                opacity: [0.95, 1, 0.95],
              } : {}}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative w-full h-full"
            >
              <Image
                src="/forged-logo.png"
                alt="Forged in the Fire"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Phase 3: Mission Line */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ 
              opacity: phase >= 3 ? 1 : 0,
              y: phase >= 3 ? 0 : 15,
            }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-serif text-lg italic text-[#F6F0E8] mb-6"
          >
            "Now we stand resolute, to bring what's in darkness to light."
          </motion.p>

          {/* Phase 4: Final Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ 
              opacity: phase >= 4 ? 1 : 0,
              y: phase >= 4 ? 0 : 10,
              scale: phase >= 4 ? 1 : 0.98,
            }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-serif text-2xl italic text-[#F6F0E8]"
          >
            "The fire that forges us also frees us."
          </motion.p>
        </div>
      </div>
    </div>
  );
}

// Reduced motion version - static final state
function ReducedMotionCard() {
  return (
    <div 
      className="aspect-square rounded-2xl p-1"
      style={{
        background: 'linear-gradient(135deg, rgba(30,107,115,0.25) 0%, rgba(58,42,36,0.8) 50%, rgba(139,94,60,0.25) 100%)',
      }}
    >
      <div 
        className="w-full h-full rounded-xl flex items-center justify-center relative overflow-hidden"
        style={{
          background: '#241B18',
          boxShadow: '0 20px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(200,164,107,0.1)',
        }}
      >
        {/* Static ambient glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(30,107,115,0.15) 0%, transparent 50%)',
          }}
        />
        
        <div className="text-center p-8 relative z-10 flex flex-col items-center justify-center h-full">
          {/* Logo - static */}
          <div className="relative mb-6" style={{ width: '8rem', height: '12rem' }}>
            <div 
              className="absolute inset-0 -m-6 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(30,107,115,0.3) 0%, rgba(200,164,107,0.15) 50%, transparent 70%)',
                filter: 'blur(15px)',
              }}
            />
            <Image
              src="/forged-logo.png"
              alt="Forged in the Fire"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>

          {/* Final tagline only */}
          <p className="font-serif text-2xl italic text-[#F6F0E8]">
            "The fire that forges us also frees us."
          </p>
        </div>
      </div>
    </div>
  );
}
