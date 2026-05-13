'use client';

import { motion, useReducedMotion, useAnimation, Variants, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState, useRef, useCallback } from 'react';

// Smooth, flowing timing with gentle overlaps
const TIMING = {
  sparkIn: 0,
  sparkHold: 2800,      // Comfortable reading pace
  sparkOut: 3500,       // Smooth exit overlap with logo
  logoIgnite: 4000,     // Logo emerges as spark fades
  missionIn: 6500,      // Pause to appreciate logo
  missionHold: 9500,    // Contemplative hold
  missionOut: 10500,    // Gentle fade
  taglineIn: 11500,     // Graceful finale
  sequenceComplete: 15000, // Settled, complete
};

// Silky smooth easing - more organic motion
const EASE = {
  cinematic: [0.22, 0.61, 0.36, 1],      // Smooth deceleration
  dramatic: [0.165, 0.84, 0.44, 1],     // Elegant power
  soft: [0.4, 0, 0.2, 1],               // Gentle ease
  silk: [0.25, 0.46, 0.45, 0.94],        // Buttery smooth
  breathe: { type: 'spring', stiffness: 80, damping: 20, mass: 1.2 },
};

// Silky word animation - slower, more elegant
const wordVariants: Variants = {
  hidden: { opacity: 0, y: 10, filter: 'blur(6px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.1,
      duration: 0.7,
      ease: EASE.silk,
    },
  }),
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(4px)',
    transition: { duration: 0.6, ease: EASE.soft },
  },
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: EASE.cinematic },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(4px)',
    transition: { duration: 0.7, ease: EASE.soft },
  },
};

export function MissionMomentCardV2() {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [sparkWords, setSparkWords] = useState<string[]>([]);
  const [missionWords, setMissionWords] = useState<string[]>([]);
  const [sequenceKey, setSequenceKey] = useState(0);
  const [showBurst, setShowBurst] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  // Split text for word animation
  useEffect(() => {
    setSparkWords('A spark lit the forge to illuminate the night.'.split(' '));
    setMissionWords("Now we stand resolute, to bring what's in darkness to light.".split(' '));
  }, []);

  // Scroll-triggered restart using IntersectionObserver
  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // Card is 50%+ visible - restart animation
            if (hasAnimatedRef.current) {
              // Restart sequence
              setPhase(0);
              setShowBurst(false);
              setSequenceKey(prev => prev + 1);
            }
            hasAnimatedRef.current = true;
          }
        });
      },
      {
        threshold: [0, 0.5, 1],
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  // Sequence timing - restarted by sequenceKey change
  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase(4);
      controls.start('complete');
      return;
    }

    const sequence = async () => {
      // Reset
      setPhase(0);
      setShowBurst(false);
      
      // Spark line appears
      await new Promise(r => setTimeout(r, 100));
      setPhase(1);
      await new Promise(r => setTimeout(r, TIMING.sparkHold));
      
      // Spark fades, logo ignites
      setPhase(2);
      setShowBurst(true);
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
  }, [prefersReducedMotion, controls, sequenceKey]);

  // Mouse-reactive glow tracking
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || prefersReducedMotion) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Clamp to 0-1 range with padding for edge effects
    setMousePos({
      x: Math.max(0.1, Math.min(0.9, x)),
      y: Math.max(0.1, Math.min(0.9, y)),
    });
  }, [prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0.5, y: 0.5 });
  }, []);

  if (prefersReducedMotion) {
    return <ReducedMotionCard />;
  }

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="aspect-square rounded-2xl p-1 relative cursor-default"
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
        {/* Vignette overlay */}
        <div 
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
          }}
        />

        {/* Mouse-reactive ambient glow */}
        <MouseReactiveGlow mousePos={mousePos} phase={phase} />

        {/* Ambient glow layers */}
        <AmbientGlow phase={phase} />

        {/* Ember particles */}
        <EmberParticles />

        {/* Particle burst on logo ignition */}
        <ParticleBurst show={showBurst && phase === 2} />

        {/* Content container */}
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

          {/* Phase 1: Spark Line */}
          <AnimatePresence mode="wait">
            {phase === 1 && (
              <motion.div
                key={`spark-${sequenceKey}`}
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

          {/* Phase 2 & 3 & 4: Logo with silk-smooth breathing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
            animate={{ 
              opacity: phase >= 2 ? 1 : 0,
              scale: phase >= 2 ? 1 : 0.9,
              filter: phase >= 2 ? 'blur(0px)' : 'blur(4px)',
            }}
            transition={{ duration: 1.4, ease: EASE.cinematic }}
            className="relative my-4"
            style={{ width: '7.5rem', height: '11.25rem' }}
          >
            <LogoGlow phase={phase} mousePos={mousePos} />
            
            <motion.div
              animate={phase >= 4 ? {
                scale: [1, 1.012, 1],
                opacity: [0.98, 1, 0.98],
              } : {}}
              transition={{
                duration: 6,
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
                key={`mission-${sequenceKey}`}
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

          {/* Phase 4: Final Tagline - Silky smooth entrance */}
          <AnimatePresence mode="wait">
            {phase >= 4 && (
              <motion.div
                key={`tagline-${sequenceKey}`}
                initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  filter: 'blur(0px)',
                }}
                transition={{ 
                  duration: 1.4, 
                  ease: EASE.silk,
                }}
                className="relative z-10"
              >
                <p 
                  className="font-serif text-2xl italic text-[#F6F0E8] leading-relaxed tracking-tight"
                  style={{ textShadow: '0 4px 30px rgba(30,107,115,0.2)' }}
                >
                  "The fire that forges us
                  <br />
                  also frees us."
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Mouse-reactive glow that follows cursor
function MouseReactiveGlow({ mousePos, phase }: { mousePos: { x: number; y: number }; phase: number }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: phase >= 1 ? 0.5 : 0 }}
      transition={{ duration: 1 }}
      style={{
        background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(30,107,115,0.25) 0%, transparent 50%)`,
      }}
    />
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

// Logo glow with pulsing heart center - enhanced with mouse reactivity
function LogoGlow({ phase, mousePos }: { phase: number; mousePos: { x: number; y: number } }) {
  // Subtle parallax offset based on mouse
  const parallaxX = (mousePos.x - 0.5) * 10;
  const parallaxY = (mousePos.y - 0.5) * 10;

  return (
    <>
      {/* Outer aura with parallax */}
      <motion.div
        className="absolute inset-0 -m-8 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: phase >= 2 ? 0.6 : 0,
          x: parallaxX,
          y: parallaxY,
        }}
        transition={{ opacity: { duration: 1.2 }, x: { duration: 0.3 }, y: { duration: 0.3 } }}
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

      {/* Heart/core pulse with parallax */}
      <motion.div
        className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: phase >= 2 ? 1 : 0,
          scale: phase >= 2 ? [1, 1.2, 1] : 1,
          x: parallaxX * 1.5,
          y: parallaxY * 1.5,
        }}
        transition={{
          opacity: { duration: 0.8 },
          scale: {
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
          x: { duration: 0.3 },
          y: { duration: 0.3 },
        }}
        style={{
          background: 'radial-gradient(circle, rgba(30,107,115,0.5) 0%, rgba(76,154,163,0.25) 50%, transparent 70%)',
          filter: 'blur(10px)',
        }}
      />
    </>
  );
}

// Silk-smooth particle burst on logo ignition
function ParticleBurst({ show }: { show: boolean }) {
  const particles = [...Array(10)].map((_, i) => ({
    id: i,
    angle: (i / 10) * 360 + Math.random() * 25,
    distance: 35 + Math.random() * 30,
    size: 2 + Math.random() * 2,
    duration: 0.8 + Math.random() * 0.5,
    delay: Math.random() * 0.08,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
      <AnimatePresence>
        {show && particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            initial={{ 
              opacity: 0,
              scale: 0,
              x: 0,
              y: 0,
            }}
            animate={{ 
              opacity: [0, 0.9, 0],
              scale: [0, 1, 0.3],
              x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
              y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: EASE.silk,
            }}
            style={{
              width: p.size,
              height: p.size,
              background: `radial-gradient(circle, rgba(${210 + Math.random() * 30}, ${170 + Math.random() * 25}, ${120 + Math.random() * 30}, 0.85) 0%, transparent 70%)`,
              boxShadow: `0 0 ${p.size * 2.5}px rgba(200, 164, 107, 0.5)`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Elegant floating ember particles
function EmberParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 1.5 + (i % 2) * 0.5,
            height: 1.5 + (i % 2) * 0.5,
            background: 'radial-gradient(circle, rgba(200, 164, 107, 0.5) 0%, transparent 70%)',
            left: `${25 + i * 11}%`,
            top: `${35 + (i % 3) * 18}%`,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0, 0.4, 0],
            x: [0, (i % 2 === 0 ? 8 : -8), 0],
          }}
          transition={{
            duration: 7 + i * 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 2,
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
            "The fire that forges us
            <br />
            also frees us."
          </p>
        </div>
      </div>
    </div>
  );
}
