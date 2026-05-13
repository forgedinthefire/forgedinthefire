'use client';

import { motion, useReducedMotion, useAnimation, Variants, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

// Production timing - precise narrative beats
const TIMING = {
  sparkIn: 0,
  sparkHold: 1800,
  sparkOut: 2200,
  logoIgnite: 2600,
  missionIn: 4200,
  missionHold: 5800,
  missionOut: 6400,
  taglineIn: 7000,
  sequenceComplete: 9000,
};

// Premium easing curves
const EASE = {
  cinematic: [0.25, 0.1, 0.25, 1],
  dramatic: [0.16, 1, 0.3, 1],
  soft: [0.4, 0, 0.2, 1],
  elastic: { type: 'spring', stiffness: 100, damping: 15 },
};

// Word animation variants
const wordVariants: Variants = {
  hidden: { opacity: 0, y: 8, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: EASE.cinematic,
    },
  }),
  exit: {
    opacity: 0,
    y: -6,
    filter: 'blur(2px)',
    transition: { duration: 0.4, ease: EASE.soft },
  },
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE.cinematic },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.5, ease: EASE.soft },
  },
};

export function MissionMomentCardV2() {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [sparkWords, setSparkWords] = useState<string[]>([]);
  const [missionWords, setMissionWords] = useState<string[]>([]);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Split text for word animation
  useEffect(() => {
    setSparkWords('A spark lit the forge to illuminate the night.'.split(' '));
    setMissionWords("Now we stand resolute, to bring what's in darkness to light.".split(' '));
  }, []);

  // Sequence timing
  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase(4);
      controls.start('complete');
      return;
    }

    const sequence = async () => {
      // Spark line appears
      setPhase(1);
      await new Promise(r => setTimeout(r, TIMING.sparkHold));
      
      // Spark fades, logo ignites
      setPhase(2);
      await new Promise(r => setTimeout(r, TIMING.logoIgnite - TIMING.sparkHold));
      
      // Mission line appears
      setPhase(3);
      await new Promise(r => setTimeout(r, TIMING.missionHold - TIMING.logoIgnite));
      
      // Mission fades, tagline appears
      setPhase(4);
      await new Promise(r => setTimeout(r, TIMING.sequenceComplete - TIMING.missionHold));
      
      controls.start('complete');
    };

    sequence();
  }, [prefersReducedMotion, controls]);

  if (prefersReducedMotion) {
    return <ReducedMotionCard />;
  }

  return (
    <div 
      ref={containerRef}
      className="aspect-square rounded-2xl p-1 relative"
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
        {/* Vignette overlay for cinematic depth */}
        <div 
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
          }}
        />

        {/* Ambient glow layers */}
        <AmbientGlow phase={phase} />

        {/* Ember particles - subtle */}
        <EmberParticles />

        {/* Content container with glass backdrop */}
        <div className="text-center px-6 py-8 relative z-10 flex flex-col items-center justify-center h-full max-w-[280px]">
          
          {/* Glass morphism text backdrop */}
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 && phase <= 3 ? 0.3 : 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'linear-gradient(180deg, rgba(36,27,24,0.6) 0%, rgba(30,107,115,0.1) 50%, rgba(36,27,24,0.6) 100%)',
              backdropFilter: 'blur(8px)',
            }}
          />

          {/* Phase 1: Spark Line - Word by word reveal */}
          <AnimatePresence mode="wait">
            {phase === 1 && (
              <motion.div
                key="spark"
                className="relative z-10"
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <p className="font-serif text-lg italic text-[#C8A46B] leading-relaxed">
                  {sparkWords.map((word, i) => (
                    <motion.span
                      key={i}
                      custom={i}
                      variants={wordVariants}
                      initial="hidden"
                      animate="visible"
                      className="inline-block mr-[0.3em]"
                    >
                      {word}
                    </motion.span>
                  ))}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 2 & 3 & 4: Logo with continuous breathing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ 
              opacity: phase >= 2 ? 1 : 0,
              scale: phase >= 2 ? 1 : 0.85,
            }}
            transition={{ duration: 1, ease: EASE.dramatic }}
            className="relative my-4"
            style={{ width: '7.5rem', height: '11.25rem' }}
          >
            <LogoGlow phase={phase} />
            
            <motion.div
              animate={phase >= 4 ? {
                scale: [1, 1.015, 1],
                opacity: [0.95, 1, 0.95],
              } : {}}
              transition={{
                duration: 5,
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
          <AnimatePresence mode="wait">
            {phase === 3 && (
              <motion.div
                key="mission"
                variants={lineVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative z-10"
              >
                <p className="font-serif text-base italic text-[#E8DDD4] leading-relaxed tracking-wide">
                  "Now we stand resolute, to bring
                  <br />
                  what's in darkness to light."
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 4: Final Tagline - Premium typography */}
          <AnimatePresence mode="wait">
            {phase >= 4 && (
              <motion.div
                key="tagline"
                initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  filter: 'blur(0px)',
                }}
                transition={{ 
                  duration: 0.9, 
                  ease: EASE.dramatic,
                  delay: phase === 4 ? 0.3 : 0,
                }}
                className="relative z-10"
              >
                <p 
                  className="font-serif text-2xl italic text-[#F6F0E8] leading-tight"
                  style={{ textShadow: '0 2px 20px rgba(30,107,115,0.3)' }}
                >
                  "The fire that
                  <span className="text-[#C8A46B]"> forges</span> us
                  <br />
                  also <span className="text-[#4C9AA3]">frees</span> us."
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Ambient glow that intensifies with phases
function AmbientGlow({ phase }: { phase: number }) {
  return (
    <>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: phase >= 1 ? (phase >= 4 ? 0.6 : 1) : 0,
        }}
        transition={{ duration: 1.2 }}
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(30,107,115,0.2) 0%, transparent 50%)',
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 2 ? 0.6 : 0 }}
        transition={{ duration: 1.5 }}
        style={{
          background: 'radial-gradient(circle at 70% 70%, rgba(139,94,60,0.15) 0%, transparent 45%)',
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: phase >= 2 ? (phase >= 4 ? 0.5 : 0.8) : 0,
          scale: phase >= 2 ? 1 : 0.8,
        }}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          className="w-56 h-56 rounded-full"
          animate={phase >= 2 ? {
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.08, 1],
          } : {}}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: 'radial-gradient(circle, rgba(30,107,115,0.35) 0%, rgba(76,154,163,0.15) 40%, transparent 70%)',
            filter: 'blur(35px)',
          }}
        />
      </motion.div>
    </>
  );
}

// Logo glow with pulsing heart center
function LogoGlow({ phase }: { phase: number }) {
  return (
    <>
      {/* Outer aura */}
      <motion.div
        className="absolute inset-0 -m-8 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 2 ? 0.6 : 0 }}
        transition={{ duration: 1.2 }}
      >
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full"
          animate={phase >= 2 ? {
            opacity: [0.3, 0.5, 0.3],
            scale: [0.95, 1.02, 0.95],
          } : {}}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: 'radial-gradient(circle, rgba(30,107,115,0.4) 0%, rgba(200,164,107,0.15) 50%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
      </motion.div>

      {/* Heart/core pulse */}
      <motion.div
        className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: phase >= 2 ? 1 : 0,
          scale: phase >= 2 ? [1, 1.2, 1] : 1,
        }}
        transition={{
          opacity: { duration: 0.8 },
          scale: {
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
        style={{
          background: 'radial-gradient(circle, rgba(30,107,115,0.5) 0%, rgba(76,154,163,0.25) 50%, transparent 70%)',
          filter: 'blur(10px)',
        }}
      />
    </>
  );
}

// Subtle ember particles
function EmberParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 2 + (i % 2),
            height: 2 + (i % 2),
            background: 'radial-gradient(circle, rgba(200, 164, 107, 0.6) 0%, transparent 70%)',
            left: `${20 + i * 12}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.5, 0],
            x: [0, (i % 2 === 0 ? 10 : -10), 0],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.2,
          }}
        />
      ))}
    </div>
  );
}

// Reduced motion version
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
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(30,107,115,0.15) 0%, transparent 50%)',
          }}
        />
        
        <div className="text-center p-8 relative z-10 flex flex-col items-center justify-center h-full">
          <div className="relative mb-6" style={{ width: '7.5rem', height: '11.25rem' }}>
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

          <p className="font-serif text-2xl italic text-[#F6F0E8] leading-tight">
            "The fire that <span className="text-[#C8A46B]">forges</span> us
            <br />
            also <span className="text-[#4C9AA3]">frees</span> us."
          </p>
        </div>
      </div>
    </div>
  );
}
