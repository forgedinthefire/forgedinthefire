'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal-800 to-charcoal" />
        
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ember/10 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-healing/10 rounded-full blur-3xl animate-glow-pulse delay-1000" />
        
        <div className="relative z-10 container-wide section-padding pt-32 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <span className="inline-block px-4 py-2 mb-6 text-sm font-medium text-ember bg-ember/10 rounded-full border border-ember/20">
                Empowering Survivors Since 2020
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-cream-100 mb-6 tracking-tight"
            >
              From Surviving{' '}
              <span className="text-gradient-ember">to Thriving</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="text-xl sm:text-2xl text-cream-300/90 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              {ORG.mission}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button asChild size="lg" className="bg-ember hover:bg-ember-600 text-cream-100 px-8">
                <Link href="/get-help">
                  Get Help <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-cream-100/20 text-cream-100 hover:bg-cream-100/10 px-8">
                <Link href="/donate">
                  Donate <Heart className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-charcoal-900 border-y border-steel-800">
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
                <div className="font-serif text-4xl sm:text-5xl font-bold text-ember mb-2">
                  {stat.value}
                </div>
                <div className="text-cream-100 font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-cream-300/70">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-charcoal">
        <div className="container-wide section-padding">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-ember font-medium mb-4 block">Our Mission</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-cream-100 mb-6">
                Healing Through <span className="text-healing">Leadership</span>
              </h2>
              <p className="text-lg text-cream-300/80 mb-6 leading-relaxed">
                We believe that survivors are the experts of their own experiences. Our approach centers 
                on amplifying survivor voices, honoring their choices, and walking alongside them on 
                their journey to healing and independence.
              </p>
              <p className="text-lg text-cream-300/80 mb-8 leading-relaxed">
                Every service we provide is rooted in trauma-informed care, recognizing that healing 
                is not linear and that each survivor&apos;s path is unique.
              </p>
              <Button asChild variant="outline" className="border-ember text-ember hover:bg-ember/10">
                <Link href="/about">Learn Our Story <ChevronRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-ember/20 to-healing/20 p-1">
                <div className="w-full h-full rounded-xl bg-charcoal-800 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Flame className="h-24 w-24 text-ember mx-auto mb-6" />
                    <p className="font-serif text-2xl text-cream-100 italic">
                      &ldquo;The fire that forges us also frees us.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-ember/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-healing/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-charcoal-900">
        <div className="container-wide section-padding">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-ember font-medium mb-4 block">What Guides Us</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-cream-100 mb-6">
              Our Core Values
            </h2>
            <p className="text-lg text-cream-300/80">
              These principles shape every interaction, program, and decision we make.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CORE_VALUES.map((value, index) => {
              const IconComponent = valueIcons[value.icon] || Heart;
              return (
                <Card key={index} className="bg-charcoal-800/50 border-steel-700 hover:border-ember/30 transition-colors group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-ember/10 flex items-center justify-center mb-4 group-hover:bg-ember/20 transition-colors">
                      {IconComponent && <IconComponent className="h-6 w-6 text-ember" />}
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-cream-100 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-cream-300/70">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-charcoal">
        <div className="container-wide section-padding">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-ember font-medium mb-4 block">Comprehensive Support</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-cream-100 mb-6">
              Our Services
            </h2>
            <p className="text-lg text-cream-300/80">
              Holistic, trauma-informed programs designed to meet survivors where they are 
              and support them on their journey to independence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.slice(0, 6).map((service) => {
              const IconComponent = serviceIcons[service.icon] || Shield;
              return (
                <Link key={service.id} href={`/services/${service.id}`}>
                  <Card className="h-full bg-charcoal-800/50 border-steel-700 hover:border-ember/50 transition-all group">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-ember/10 flex items-center justify-center shrink-0 group-hover:bg-ember/20 transition-colors">
                          {IconComponent && <IconComponent className="h-6 w-6 text-ember" />}
                        </div>
                        <div>
                          <h3 className="font-serif text-lg font-semibold text-cream-100 mb-2 group-hover:text-ember transition-colors">
                            {service.shortTitle}
                          </h3>
                          <p className="text-sm text-cream-300/70 line-clamp-2">
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
            <Button asChild variant="outline" className="border-ember text-ember hover:bg-ember/10">
              <Link href="/services">View All Services <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
