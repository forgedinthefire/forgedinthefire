import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ORG, CORE_VALUES } from '@/lib/constants';
import { generateMetaTags } from '@/lib/utils';
import { Heart, Users, ChevronRight, Award, Calendar } from 'lucide-react';

export const metadata: Metadata = generateMetaTags({
  title: 'About Us',
  description: `Learn about ${ORG.name}'s mission, vision, and survivor-centered approach to supporting survivors of sex trafficking.`,
});

const TEAM_MEMBERS = [
  {
    name: 'Founder Name',
    role: 'Founder & Executive Director',
    bio: 'A passionate advocate with lived experience who founded Forged in the Fire to create the support she wished she had.',
    image: null,
  },
  {
    name: 'Program Director',
    role: 'Director of Programs',
    bio: 'Oversees all survivor services with 10+ years of experience in trauma-informed care and victim advocacy.',
    image: null,
  },
  {
    name: 'Lead Advocate',
    role: 'Lead Victim Advocate',
    bio: 'Specializes in court accompaniment, crisis intervention, and survivor safety planning.',
    image: null,
  },
];

const PARTNERS = [
  'National Human Trafficking Hotline',
  'Local Law Enforcement Agencies',
  'District Attorney Offices',
  'Community Health Centers',
  'Housing Authorities',
  'Legal Aid Organizations',
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-charcoal-900 to-charcoal">
        <div className="container-wide section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-ember font-medium mb-4 block">About Us</span>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold text-cream-100 mb-6">
              Our Story
            </h1>
            <p className="text-xl text-cream-300/80 leading-relaxed">
              Born from lived experience and a commitment to survivor-centered care, 
              Forged in the Fire has been empowering survivors since 2020.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-charcoal">
        <div className="container-wide section-padding">
          <div className="grid lg:grid-cols-2 gap-16">
            <Card className="bg-charcoal-800/50 border-steel-700">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-ember/10 flex items-center justify-center mb-6">
                  <Heart className="h-6 w-6 text-ember" />
                </div>
                <h2 className="font-serif text-3xl font-bold text-cream-100 mb-4">Our Mission</h2>
                <p className="text-lg text-cream-300/80 leading-relaxed">{ORG.mission}</p>
              </CardContent>
            </Card>
            <Card className="bg-charcoal-800/50 border-steel-700">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-healing/10 flex items-center justify-center mb-6">
                  <Award className="h-6 w-6 text-healing" />
                </div>
                <h2 className="font-serif text-3xl font-bold text-cream-100 mb-4">Our Vision</h2>
                <p className="text-lg text-cream-300/80 leading-relaxed">{ORG.vision}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Survivor-Centered Philosophy */}
      <section className="py-24 bg-charcoal-900">
        <div className="container-wide section-padding">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-healing font-medium mb-4 block">Our Approach</span>
            <h2 className="font-serif text-4xl font-bold text-cream-100 mb-6">
              Survivor-Centered Philosophy
            </h2>
            <p className="text-lg text-cream-300/80">
              Everything we do is guided by the belief that survivors are the experts of their own experiences.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: 'Trauma-Informed Care',
                description: 'We recognize the widespread impact of trauma and integrate this understanding into all our policies and practices.',
              },
              {
                title: 'Survivor Leadership',
                description: 'Survivors guide our programming, ensuring services meet real needs and honor lived experiences.',
              },
              {
                title: 'Safety & Autonomy',
                description: 'We prioritize physical and emotional safety while respecting each survivor\'s right to self-determination.',
              },
              {
                title: 'Cultural Humility',
                description: 'We recognize and respect diverse backgrounds, ensuring inclusive and culturally responsive services.',
              },
            ].map((item, index) => (
              <Card key={index} className="bg-charcoal-800/50 border-steel-700">
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-semibold text-cream-100 mb-3">{item.title}</h3>
                  <p className="text-cream-300/70">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-charcoal">
        <div className="container-wide section-padding">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-ember font-medium mb-4 block">What Drives Us</span>
            <h2 className="font-serif text-4xl font-bold text-cream-100 mb-6">Core Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CORE_VALUES.map((value, index) => (
              <Card key={index} className="bg-charcoal-800/50 border-steel-700">
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-semibold text-cream-100 mb-3">{value.title}</h3>
                  <p className="text-cream-300/70">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section id="team" className="py-24 bg-charcoal-900">
        <div className="container-wide section-padding">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-ember font-medium mb-4 block">Our Team</span>
            <h2 className="font-serif text-4xl font-bold text-cream-100 mb-6">Leadership</h2>
            <p className="text-lg text-cream-300/80">
              Dedicated professionals and survivor-leaders committed to our mission.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {TEAM_MEMBERS.map((member, index) => (
              <Card key={index} className="bg-charcoal-800/50 border-steel-700 text-center">
                <CardContent className="p-6">
                  <div className="w-24 h-24 rounded-full bg-ember/20 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-10 w-10 text-ember" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-cream-100 mb-1">{member.name}</h3>
                  <p className="text-ember text-sm mb-3">{member.role}</p>
                  <p className="text-cream-300/70 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partnerships */}
      <section id="partners" className="py-24 bg-charcoal">
        <div className="container-wide section-padding">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-healing font-medium mb-4 block">Collaboration</span>
            <h2 className="font-serif text-4xl font-bold text-cream-100 mb-6">Community Partners</h2>
            <p className="text-lg text-cream-300/80">
              We work alongside these organizations to provide comprehensive support.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {PARTNERS.map((partner, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-charcoal-800/30 rounded-lg border border-steel-700/50">
                <div className="w-2 h-2 rounded-full bg-healing" />
                <span className="text-cream-300">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-charcoal-900 to-charcoal">
        <div className="container-wide section-padding">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-4xl font-bold text-cream-100 mb-6">
              Join Our Mission
            </h2>
            <p className="text-xl text-cream-300/80 mb-8">
              Whether through donation, volunteering, or partnership, your support makes a difference.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-ember hover:bg-ember-600">
                <Link href="/donate">Donate <ChevronRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-healing text-healing hover:bg-healing/10">
                <Link href="/volunteer">Volunteer <ChevronRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
