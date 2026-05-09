'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';

const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const defaultVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled
          ? 'bg-warm-ivory/95 backdrop-blur-md shadow-warm border-b border-forge-100'
          : 'bg-warm-ivory/80 backdrop-blur-sm'
      )}
      role="banner"
    >
      <nav
        className="container-wide section-padding"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="Forged in the Fire - Home"
          >
            <div className="relative w-11 h-11 overflow-hidden">
              <Image
                src="/logo-main.png"
                alt="Forged in the Fire"
                fill
                className="object-contain transition-all duration-500 ease-out group-hover:scale-105"
                priority
                sizes="44px"
              />
            </div>
            <span className="font-serif text-xl font-semibold text-charcoal-800 hidden sm:block">
              Forged in the Fire
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md',
                  isActive(link.href)
                    ? 'text-forge-600'
                    : 'text-charcoal-700 hover:text-forge-600',
                  'priority' in link && link.priority && 'text-forge-600 font-semibold'
                )}
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-forge-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-charcoal-700 hover:text-forge-600"
            >
              <Link href="/get-help">Get Help</Link>
            </Button>
            <Button
              asChild
              variant="default"
              size="sm"
              className="bg-forge-600 hover:bg-forge-700 text-white shadow-warm hover:shadow-warm-lg"
            >
              <Link href="/donate">Donate</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-charcoal-700 hover:text-forge-600 transition-colors"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={defaultVariants}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-20 z-30 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-warm-ivory/98 backdrop-blur-lg"
              onClick={() => setIsOpen(false)}
            />
            <nav
              className="relative h-full overflow-y-auto px-4 py-8"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col gap-2">
                {NAV_LINKS.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'block px-4 py-4 text-lg font-medium rounded-lg transition-colors',
                        isActive(link.href)
                          ? 'bg-forge-50 text-forge-700'
                          : 'text-charcoal-700 hover:bg-forge-50/50 hover:text-forge-600'
                      )}
                      aria-current={isActive(link.href) ? 'page' : undefined}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile CTA Section */}
              <div className="mt-8 pt-8 border-t border-forge-100">
                <div className="flex flex-col gap-3">
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full border-forge-500 text-forge-600 hover:bg-forge-50"
                  >
                    <Link href="/get-help" onClick={() => setIsOpen(false)}>
                      Get Help Now
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="default"
                    size="lg"
                    className="w-full bg-forge-600 hover:bg-forge-700 text-white shadow-warm"
                  >
                    <Link href="/donate" onClick={() => setIsOpen(false)}>
                      Donate Today
                    </Link>
                  </Button>
                </div>

                {/* Emergency Info */}
                <div className="mt-6 p-4 bg-bronze-50 rounded-lg border border-bronze-100">
                  <p className="text-sm text-charcoal-700 font-medium mb-2">
                    National Human Trafficking Hotline
                  </p>
                  <a
                    href="tel:1-888-373-7888"
                    className="text-lg font-bold text-bronze-600 hover:text-bronze-700"
                  >
                    1-888-373-7888
                  </a>
                  <p className="text-xs text-charcoal-600/70 mt-1">
                    Text &quot;BEFREE&quot; to 233733
                  </p>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
