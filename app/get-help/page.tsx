'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { HOTLINES } from '@/lib/constants';
import { Phone, MessageSquare, Clock, AlertTriangle, Shield, ChevronRight, Send, ExternalLink } from 'lucide-react';

export default function GetHelpPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    isSurvivor: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero - Crisis Warning */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-red-950/30 to-charcoal">
        <div className="container-wide section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-red-400 bg-red-950/30 rounded-full border border-red-800">
              <AlertTriangle className="h-4 w-4" />
              If you are in immediate danger, call 911
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold text-cream-100 mb-6">
              Get Help
            </h1>
            <p className="text-xl text-cream-300/80 leading-relaxed max-w-2xl mx-auto">
              You are not alone. Confidential support is available 24/7. 
              Reach out when you&apos;re ready—we&apos;re here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Hotlines */}
      <section className="py-20 bg-charcoal-900 border-y border-steel-800">
        <div className="container-wide section-padding">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-3xl font-bold text-cream-100 mb-4">
              24/7 Crisis Hotlines
            </h2>
            <p className="text-cream-300/80">
              These confidential hotlines provide immediate support, resources, and guidance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {HOTLINES.map((hotline, index) => (
              <Card key={index} className="bg-charcoal-800/50 border-steel-700 hover:border-healing/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-healing/10 flex items-center justify-center shrink-0">
                      <Phone className="h-6 w-6 text-healing" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-cream-100 mb-1">{hotline.name}</h3>
                      <a 
                        href={`tel:${hotline.phone.replace(/\D/g, '')}`}
                        className="text-2xl font-bold text-healing hover:text-healing-400 block mb-2"
                      >
                        {hotline.phone}
                      </a>
                      {hotline.sms && (
                        <p className="text-sm text-cream-300/70 mb-2">
                          Text &quot;{hotline.text}&quot; to {hotline.sms}
                        </p>
                      )}
                      <p className="text-sm text-cream-300/60">{hotline.description}</p>
                      <div className="flex items-center gap-2 mt-3 text-healing text-sm">
                        <Clock className="h-4 w-4" />
                        <span>Available {hotline.available}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Survivor Rights */}
      <section className="py-24 bg-charcoal">
        <div className="container-wide section-padding">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-ember font-medium mb-4 block">Your Rights</span>
              <h2 className="font-serif text-4xl font-bold text-cream-100 mb-6">
                You Have Rights
              </h2>
              <div className="space-y-4">
                {[
                  'The right to safety and confidentiality',
                  'The right to be believed and supported',
                  'The right to make your own choices',
                  'The right to access services without judgment',
                  'The right to legal protection and advocacy',
                  'The right to heal at your own pace',
                ].map((right, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-ember/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Shield className="h-3 w-3 text-ember" />
                    </div>
                    <p className="text-cream-300/80">{right}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-charcoal-800/50 rounded-2xl p-8 border border-steel-700">
              <Shield className="h-16 w-16 text-healing mb-6" />
              <h3 className="font-serif text-2xl font-bold text-cream-100 mb-4">
                Safety Planning
              </h3>
              <p className="text-cream-300/80 mb-6">
                Our advocates can work with you to create a personalized safety plan 
                tailored to your unique situation and needs.
              </p>
              <Button asChild variant="outline" className="border-healing text-healing hover:bg-healing/10">
                <Link href="/services/victim-advocacy">Learn About Advocacy <ChevronRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 bg-charcoal-900">
        <div className="container-wide section-padding">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-ember font-medium mb-4 block">Reach Out</span>
              <h2 className="font-serif text-4xl font-bold text-cream-100 mb-4">
                Contact Our Team
              </h2>
              <p className="text-cream-300/80">
                Fill out this form and a member of our team will reach out to you within 24 hours.
                All communications are confidential.
              </p>
            </div>

            {submitted ? (
              <Card className="bg-charcoal-800/50 border-healing/30">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-healing/20 flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-healing" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-cream-100 mb-2">
                    Message Sent
                  </h3>
                  <p className="text-cream-300/80">
                    Thank you for reaching out. A member of our team will contact you within 24 hours.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-charcoal-800/50 border-steel-700">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name (optional)</Label>
                        <Input
                          id="name"
                          placeholder="How should we address you?"
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email or Phone *</Label>
                        <Input
                          id="email"
                          type="text"
                          required
                          placeholder="How can we reach you?"
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        required
                        rows={5}
                        placeholder="Tell us how we can help. You can share as much or as little as you're comfortable with."
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      />
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-charcoal-900/50 rounded-lg">
                      <input
                        type="checkbox"
                        id="isSurvivor"
                        checked={formState.isSurvivor}
                        onChange={(e) => setFormState({ ...formState, isSurvivor: e.target.checked })}
                        className="mt-1 h-4 w-4 rounded border-steel-600 bg-charcoal-800 text-ember focus:ring-ember"
                      />
                      <Label htmlFor="isSurvivor" className="text-sm text-cream-300/80 leading-relaxed cursor-pointer">
                        I am a survivor seeking support (this helps us connect you with the right resources)
                      </Label>
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-ember hover:bg-ember-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>

                    <p className="text-xs text-cream-300/50 text-center">
                      Your privacy is important to us. This form is secure and your information will be kept confidential.
                    </p>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
