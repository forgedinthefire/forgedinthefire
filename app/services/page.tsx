import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SERVICES } from '@/lib/constants';
import { generateMetaTags } from '@/lib/utils';
import { 
  Shield, Briefcase, Users, GraduationCap, Scale, Home, Brain,
  ArrowRight, ChevronRight 
} from 'lucide-react';

export const metadata: Metadata = generateMetaTags({
  title: 'Our Services',
  description: 'Comprehensive, trauma-informed services for survivors of sex trafficking including advocacy, housing, counseling, and workforce development.',
});

const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield, Briefcase, Users, GraduationCap, Scale, Home, Brain,
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-charcoal-900 to-charcoal">
        <div className="container-wide section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-ember font-medium mb-4 block">Comprehensive Support</span>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold text-cream-100 mb-6">
              Our Services
            </h1>
            <p className="text-xl text-cream-300/80 leading-relaxed max-w-3xl mx-auto">
              Holistic, trauma-informed programs designed to meet survivors where they are 
              and support them on their journey to healing, independence, and hope.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-charcoal">
        <div className="container-wide section-padding">
          <div className="grid lg:grid-cols-2 gap-8">
            {SERVICES.map((service) => {
              const Icon = serviceIcons[service.icon] || Shield;
              return (
                <Card key={service.id} className="bg-charcoal-800/50 border-steel-700 overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="p-8">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-14 h-14 rounded-xl bg-ember/10 flex items-center justify-center shrink-0 group-hover:bg-ember/20 transition-colors">
                          <Icon className="h-7 w-7 text-ember" />
                        </div>
                        <div>
                          <h2 className="font-serif text-2xl font-bold text-cream-100 mb-2 group-hover:text-ember transition-colors">
                            {service.title}
                          </h2>
                          <p className="text-cream-300/80">{service.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-8">
                        {service.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-ember shrink-0" />
                            <span className="text-cream-300/70">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button asChild variant="outline" className="border-ember text-ember hover:bg-ember/10">
                        <Link href={`/services/${service.id}`}>
                          Learn More <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trauma-Informed Approach */}
      <section className="py-24 bg-charcoal-900">
        <div className="container-wide section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-healing font-medium mb-4 block">Our Method</span>
              <h2 className="font-serif text-4xl font-bold text-cream-100 mb-6">
                Trauma-Informed Care
              </h2>
              <p className="text-lg text-cream-300/80">
                Every service is delivered through a trauma-informed lens, ensuring survivors 
                feel safe, empowered, and supported throughout their healing journey.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: 'Safety First', desc: 'Physical and emotional safety are prioritized in every interaction.' },
                { title: 'Trustworthiness', desc: 'Clear, consistent, and transparent communication builds trust.' },
                { title: 'Peer Support', desc: 'Survivor-led support fosters connection and mutual empowerment.' },
                { title: 'Collaboration', desc: 'Decisions are made together, honoring survivor autonomy.' },
                { title: 'Empowerment', desc: 'Strengths-based approaches build confidence and self-efficacy.' },
                { title: 'Cultural Humility', desc: 'Services are responsive to diverse cultural backgrounds.' },
              ].map((item, index) => (
                <Card key={index} className="bg-charcoal-800/30 border-steel-700/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-cream-100 mb-2">{item.title}</h3>
                    <p className="text-sm text-cream-300/70">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-charcoal">
        <div className="container-wide section-padding">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-4xl font-bold text-cream-100 mb-6">
              Ready to Get Support?
            </h2>
            <p className="text-xl text-cream-300/80 mb-8">
              Our team is here to help you navigate available resources and find the right support for your needs.
            </p>
            <Button asChild size="lg" className="bg-ember hover:bg-ember-600">
              <Link href="/get-help">Get Help Now <ChevronRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
