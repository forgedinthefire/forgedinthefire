'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HeroAnimation } from '@/components/hero-animation';
import { ORG, CORE_VALUES, SERVICES, IMPACT_STATS } from '@/lib/constants';
import { 
  ArrowRight, 
  Heart, 
  Shield, 
  Users, 
  Zap, 
  Flame,
  Briefcase,
  GraduationCap,
  Home,
  Brain,
  ChevronRight,
  HandHeart,
  Scale
} from 'lucide-react';

const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Briefcase,
  Users,
  GraduationCap,
  Scale,
  Home,
  Brain,
};

const valueIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  HandHeart,
  Shield,
  Zap,
  Users,
  Flame,
};

export function HomeContent() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Cinematic Animation */}
      <section className="relative min-h-screen">
        <HeroAnimation>
          <div className="container-wide section-padding pt-0 pb-20">
            <div className="max-w-4xl mx-auto text-center">
              {/* Tagline Badge - Staggered Fade Up */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <span className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 text-sm font-medium text-[#C8A46B] bg-[#3A2A24]/80 rounded-full border border-[#8B5E3C]/30 backdrop-blur-sm">
                  <Flame className="w-4 h-4" />
                  Empowering Survivors Since 2020
                </span>
              </motion.div>
              
              {/* Headline - Staggered Fade Up */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F6F0E8] mb-6 tracking-tight leading-tight"
              >
                Restoring Hope.
                <br />
                <span className="text-[#4C9AA3]">Rebuilding Lives.</span>
              </motion.h1>
              
              {/* Mission Statement - Staggered Fade Up */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-lg sm:text-xl text-[#CDBDAF] mb-10 max-w-2xl mx-auto leading-relaxed"
              >
                {ORG.mission}
              </motion.p>
              
              {/* CTA Buttons - Final Stagger */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Button asChild size="lg" className="bg-[#1E6B73] hover:bg-[#4C9AA3] text-[#F6F0E8] px-8 py-6 text-base shadow-[0_12px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_40px_rgba(30,107,115,0.25)] transition-all duration-300">
                  <Link href="/get-help">
                    Get Help Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-[#8B5E3C] text-[#C8A46B] hover:bg-[#8B5E3C]/14 px-8 py-6 text-base transition-all duration-300">
                  <Link href="/donate">
                    Support Our Mission <Heart className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              
              {/* Trust Indicators - Final Fade */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.3 }}
                className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-[#B8A89A]"
              >
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#4C9AA3]" />
                  501(c)(3) Nonprofit
                </span>
                <span className="w-1 h-1 rounded-full bg-[#8B5E3C]/40" />
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#4C9AA3]" />
                  Survivor-Centered
                </span>
                <span className="w-1 h-1 rounded-full bg-[#8B5E3C]/40" />
                <span className="flex items-center gap-1.5">
                  <HandHeart className="w-4 h-4 text-[#4C9AA3]" />
                  Trauma-Informed Care
                </span>
              </motion.div>
            </div>
          </div>
        </HeroAnimation>
      </section>

      {/* Impact Stats - Emotional Warmth Section */}
      <section className="py-20 bg-[#352722] border-y border-[#4A2F22]/30">
        <div className="container-wide section-padding">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {IMPACT_STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-serif text-4xl sm:text-5xl font-bold text-[#4C9AA3] mb-2">
                  {stat.value}
                </div>
                <div className="text-[#F6F0E8] font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-[#B8A89A]">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section - Warm Human Connection */}
      <section className="py-24 bg-[#241B18]">
        <div className="container-wide section-padding">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#4C9AA3] font-medium mb-4 block tracking-wide uppercase text-sm">Our Mission</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#F6F0E8] mb-6 leading-tight">
                Healing Through <span className="text-[#C8A46B]">Leadership</span>
              </h2>
              <p className="text-lg text-[#CDBDAF] mb-6 leading-relaxed">
                We believe that survivors are the experts of their own experiences. Our approach centers 
                on amplifying survivor voices, honoring their choices, and walking alongside them on 
                their journey to healing and independence.
              </p>
              <p className="text-lg text-[#CDBDAF] mb-8 leading-relaxed">
                Every service we provide is rooted in trauma-informed care, recognizing that healing 
                is not linear and that each survivor&apos;s path is unique.
              </p>
              <Button asChild variant="outline" className="border-[#1E6B73] text-[#4C9AA3] hover:bg-[#1E6B73]/20 transition-all duration-300">
                <Link href="/about">Learn Our Story <ChevronRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="relative">
              {/* Localized cinematic quote card - SCOPED STYLES ONLY */}
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
                  {/* Localized ambient glow layers - INSIDE CARD ONLY */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, rgba(30,107,115,0.15) 0%, transparent 50%)',
                    }}
                  />
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at 70% 70%, rgba(139,94,60,0.12) 0%, transparent 45%)',
                    }}
                  />
                  
                  <div className="text-center p-8 relative z-10">
                    {/* Logo with localized cinematic animation */}
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 1.2, 
                        ease: [0.25, 0.1, 0.25, 1],
                        delay: 0.2 
                      }}
                      className="relative mb-6"
                    >
                      {/* Localized glow behind logo */}
                      <motion.div
                        className="absolute inset-0 -m-4 pointer-events-none"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      >
                        <div 
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
                          style={{
                            background: 'radial-gradient(circle, rgba(30,107,115,0.25) 0%, rgba(200,164,107,0.1) 40%, transparent 70%)',
                            filter: 'blur(20px)',
                          }}
                        />
                      </motion.div>
                      
                      {/* Logo image */}
                      <motion.div
                        animate={{ 
                          opacity: [0.9, 1, 0.9],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="relative w-28 h-28 mx-auto"
                      >
                        <Image
                          src="/herologo.png"
                          alt="Forged in the Fire"
                          fill
                          className="object-contain drop-shadow-2xl"
                        />
                      </motion.div>
                    </motion.div>
                    
                    {/* Quote with localized fade animation */}
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.8, 
                        ease: [0.25, 0.1, 0.25, 1],
                        delay: 0.8 
                      }}
                      className="font-serif text-2xl italic"
                      style={{ color: '#F6F0E8' }}
                    >
                      &ldquo;The fire that forges us also frees us.&rdquo;
                    </motion.p>
                  </div>
                </div>
              </div>
              
              {/* Localized external glow effects - CARD ONLY */}
              <motion.div 
                className="absolute -top-4 -right-4 w-24 h-24 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(200,164,107,0.25) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
                animate={{ opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div 
                className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(30,107,115,0.2) 0%, transparent 70%)',
                  filter: 'blur(25px)',
                }}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values - Safety and Stability */}
      <section className="py-24 bg-[#2A1F1A]">
        <div className="container-wide section-padding">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#4C9AA3] font-medium mb-4 block tracking-wide uppercase text-sm">What Guides Us</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#F6F0E8] mb-6">
              Our Core Values
            </h2>
            <p className="text-lg text-[#CDBDAF]">
              These principles shape every interaction, program, and decision we make.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CORE_VALUES.map((value, index) => {
              const IconComponent = valueIcons[value.icon] || Heart;
              return (
                <Card key={index} className="bg-[#3A2A24] border-[rgba(216,203,190,0.08)] hover:border-[#8B5E3C]/30 transition-all duration-300 group shadow-[0_12px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-[#1E6B73]/20 flex items-center justify-center mb-4 group-hover:bg-[#1E6B73]/30 transition-colors">
                      {IconComponent && <IconComponent className="h-6 w-6 text-[#4C9AA3]" />}
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-[#F6F0E8] mb-2">
                      {value.title}
                    </h3>
                    <p className="text-[#CDBDAF] leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Preview - Hopeful Action */}
      <section className="py-24 bg-[#241B18]">
        <div className="container-wide section-padding">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#C8A46B] font-medium mb-4 block tracking-wide uppercase text-sm">Comprehensive Support</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#F6F0E8] mb-6">
              Our Services
            </h2>
            <p className="text-lg text-[#CDBDAF]">
              Holistic, trauma-informed programs designed to meet survivors where they are 
              and support them on their journey to independence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.slice(0, 6).map((service) => {
              const IconComponent = serviceIcons[service.icon] || Shield;
              return (
                <Link key={service.id} href={`/services/${service.id}`}>
                  <Card className="h-full bg-[#3A2A24] border-[rgba(216,203,190,0.08)] hover:border-[#C8A46B]/30 transition-all duration-300 group shadow-[0_12px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_40px_rgba(139,94,60,0.15)]">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#C8A46B]/10 flex items-center justify-center shrink-0 group-hover:bg-[#C8A46B]/20 transition-colors">
                          {IconComponent && <IconComponent className="h-6 w-6 text-[#C8A46B]" />}
                        </div>
                        <div>
                          <h3 className="font-serif text-lg font-semibold text-[#F6F0E8] mb-2 group-hover:text-[#C8A46B] transition-colors">
                            {service.shortTitle}
                          </h3>
                          <p className="text-sm text-[#B8A89A] line-clamp-2 leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild variant="outline" className="border-[#8B5E3C] text-[#C8A46B] hover:bg-[#8B5E3C]/14 transition-all duration-300">
              <Link href="/services">View All Services <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
