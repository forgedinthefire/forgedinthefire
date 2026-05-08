import Link from 'next/link';
import { FOOTER_LINKS, SOCIAL_LINKS, ORG, HOTLINES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Flame, Heart, Facebook, Instagram, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Facebook,
  Instagram,
  Twitter,
  LinkedIn: Linkedin,
  Youtube,
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-900 border-t border-steel-800" role="contentinfo">
      {/* Emergency Banner */}
      <div className="bg-healing/10 border-b border-healing/20">
        <div className="container-wide section-padding py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <p className="text-sm text-cream-300">
                <span className="font-semibold text-healing">Need immediate help?</span>{' '}
                Contact the National Human Trafficking Hotline
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={`tel:${HOTLINES[0].phone.replace(/\D/g, '')}`}
                className="text-lg font-bold text-healing hover:text-healing-400 transition-colors"
              >
                {HOTLINES[0].phone}
              </a>
              <span className="text-cream-300/50 text-sm">|</span>
              <span className="text-sm text-cream-300">
                Text &quot;BEFREE&quot; to {HOTLINES[0].sms}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-wide section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <Flame className="h-8 w-8 text-ember transition-transform duration-300 group-hover:scale-110" />
              <span className="font-serif text-xl font-semibold text-cream-100">
                {ORG.name}
              </span>
            </Link>
            <p className="text-cream-300/80 mb-6 max-w-sm leading-relaxed">
              {ORG.description}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href={`mailto:${ORG.email}`}
                className="flex items-center gap-3 text-cream-300 hover:text-ember transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm">{ORG.email}</span>
              </a>
              <a
                href={`tel:${ORG.phone.replace(/\D/g, '')}`}
                className="flex items-center gap-3 text-cream-300 hover:text-ember transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span className="text-sm">{ORG.phone}</span>
              </a>
              <div className="flex items-center gap-3 text-cream-300/70">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{ORG.location}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {SOCIAL_LINKS.map((social) => {
                const Icon = socialIcons[social.icon];
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-cream-300 hover:text-ember hover:bg-ember/10 rounded-full transition-all"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-cream-100 mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-300/80 hover:text-ember transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organization Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-cream-100 mb-4">
              Organization
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.organization.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-300/80 hover:text-ember transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-cream-100 mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-300/80 hover:text-ember transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-steel-800">
        <div className="container-wide section-padding py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-cream-300/60">
              {FOOTER_LINKS.legal.map((link, index) => (
                <span key={link.href} className="flex items-center gap-4">
                  <Link
                    href={link.href}
                    className="hover:text-ember transition-colors"
                  >
                    {link.label}
                  </Link>
                  {index < FOOTER_LINKS.legal.length - 1 && (
                    <span className="hidden sm:inline">|</span>
                  )}
                </span>
              ))}
            </div>
            <p className="text-sm text-cream-300/60 text-center md:text-right">
              &copy; {currentYear} {ORG.name}. All rights reserved.
              <span className="inline-flex items-center gap-1 ml-2">
                Made with <Heart className="h-3 w-3 text-ember fill-ember" /> for survivors
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
