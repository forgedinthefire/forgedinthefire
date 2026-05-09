'use client';

import Link from 'next/link';
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
          <div className="container-wide section-padding pt-8 pb-20">
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
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#1E6B73]/20 via-[#3A2A24] to-[#8B5E3C]/20 p-1">
                <div className="w-full h-full rounded-xl bg-[#241B18] flex items-center justify-center shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
                  <div className="text-center p-8">
                    <Flame className="h-24 w-24 text-[#C8A46B] mx-auto mb-6" />
                    <p className="font-serif text-2xl text-[#F6F0E8] italic">
                      &ldquo;The fire that forges us also frees us.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#C8A46B]/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#1E6B73]/20 rounded-full blur-2xl" />
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
