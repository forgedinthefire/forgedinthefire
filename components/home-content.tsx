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
                <span className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 text-sm font-medium text-bronze-700 bg-bronze-50/80 rounded-full border border-bronze-200/50 backdrop-blur-sm">
                  <Flame className="w-4 h-4" />
                  Empowering Survivors Since 2020
                </span>
              </motion.div>
              
              {/* Headline - Staggered Fade Up */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal-800 mb-6 tracking-tight leading-tight"
              >
                Restoring Hope.
                <br />
                <span className="text-forge-600">Rebuilding Lives.</span>
              </motion.h1>
              
              {/* Mission Statement - Staggered Fade Up */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-lg sm:text-xl text-charcoal-600 mb-10 max-w-2xl mx-auto leading-relaxed"
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
                <Button asChild size="lg" className="bg-forge-600 hover:bg-forge-700 text-white px-8 py-6 text-base shadow-warm hover:shadow-warm-lg transition-all duration-300">
                  <Link href="/get-help">
                    Get Help Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-bronze-500 text-bronze-600 hover:bg-bronze-50 px-8 py-6 text-base transition-all duration-300">
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
                className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-charcoal-500"
              >
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-forge-500" />
                  501(c)(3) Nonprofit
                </span>
                <span className="w-1 h-1 rounded-full bg-charcoal-300" />
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-forge-500" />
                  Survivor-Centered
                </span>
                <span className="w-1 h-1 rounded-full bg-charcoal-300" />
                <span className="flex items-center gap-1.5">
                  <HandHeart className="w-4 h-4 text-forge-500" />
                  Trauma-Informed Care
                </span>
              </motion.div>
            </div>
          </div>
        </HeroAnimation>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-forge-50/50 border-y border-forge-100">
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
                <div className="font-serif text-4xl sm:text-5xl font-bold text-forge-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-charcoal-700 font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-charcoal-500">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-warm-ivory">
        <div className="container-wide section-padding">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-forge-600 font-medium mb-4 block tracking-wide uppercase text-sm">Our Mission</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-charcoal-800 mb-6 leading-tight">
                Healing Through <span className="text-bronze-600">Leadership</span>
              </h2>
              <p className="text-lg text-charcoal-600 mb-6 leading-relaxed">
                We believe that survivors are the experts of their own experiences. Our approach centers 
                on amplifying survivor voices, honoring their choices, and walking alongside them on 
                their journey to healing and independence.
              </p>
              <p className="text-lg text-charcoal-600 mb-8 leading-relaxed">
                Every service we provide is rooted in trauma-informed care, recognizing that healing 
                is not linear and that each survivor&apos;s path is unique.
              </p>
              <Button asChild variant="outline" className="border-forge-500 text-forge-600 hover:bg-forge-50 transition-all duration-300">
                <Link href="/about">Learn Our Story <ChevronRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-forge-100 via-warm-cream to-bronze-100 p-1">
                <div className="w-full h-full rounded-xl bg-white flex items-center justify-center shadow-warm">
                  <div className="text-center p-8">
                    <Flame className="h-24 w-24 text-bronze-500 mx-auto mb-6" />
                    <p className="font-serif text-2xl text-charcoal-700 italic">
                      &ldquo;The fire that forges us also frees us.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-bronze-200/40 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-forge-100/50 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-warm-cream">
        <div className="container-wide section-padding">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-forge-600 font-medium mb-4 block tracking-wide uppercase text-sm">What Guides Us</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-charcoal-800 mb-6">
              Our Core Values
            </h2>
            <p className="text-lg text-charcoal-600">
              These principles shape every interaction, program, and decision we make.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CORE_VALUES.map((value, index) => {
              const IconComponent = valueIcons[value.icon] || Heart;
              return (
                <Card key={index} className="bg-white border-forge-100 hover:border-forge-300 transition-all duration-300 group shadow-card hover:shadow-card-hover">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-forge-50 flex items-center justify-center mb-4 group-hover:bg-forge-100 transition-colors">
                      {IconComponent && <IconComponent className="h-6 w-6 text-forge-600" />}
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-charcoal-800 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-charcoal-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-warm-ivory">
        <div className="container-wide section-padding">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-bronze-600 font-medium mb-4 block tracking-wide uppercase text-sm">Comprehensive Support</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-charcoal-800 mb-6">
              Our Services
            </h2>
            <p className="text-lg text-charcoal-600">
              Holistic, trauma-informed programs designed to meet survivors where they are 
              and support them on their journey to independence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.slice(0, 6).map((service) => {
              const IconComponent = serviceIcons[service.icon] || Shield;
              return (
                <Link key={service.id} href={`/services/${service.id}`}>
                  <Card className="h-full bg-white border-forge-100 hover:border-forge-300 transition-all duration-300 group shadow-card hover:shadow-card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-forge-50 flex items-center justify-center shrink-0 group-hover:bg-forge-100 transition-colors">
                          {IconComponent && <IconComponent className="h-6 w-6 text-forge-600" />}
                        </div>
                        <div>
                          <h3 className="font-serif text-lg font-semibold text-charcoal-800 mb-2 group-hover:text-forge-600 transition-colors">
                            {service.shortTitle}
                          </h3>
                          <p className="text-sm text-charcoal-600 line-clamp-2 leading-relaxed">
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
            <Button asChild variant="outline" className="border-forge-500 text-forge-600 hover:bg-forge-50 transition-all duration-300">
              <Link href="/services">View All Services <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
