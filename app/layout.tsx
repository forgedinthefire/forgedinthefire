import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { QuickExit } from '@/components/quick-exit';
import { META_DEFAULTS, ORG } from '@/lib/constants';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: META_DEFAULTS.title,
  description: META_DEFAULTS.description,
  keywords: [...META_DEFAULTS.keywords],
  authors: META_DEFAULTS.authors.map((name) => ({ name })),
  creator: META_DEFAULTS.creator,
  publisher: META_DEFAULTS.publisher,
  robots: META_DEFAULTS.robots,
  metadataBase: new URL('https://forgedinthefire.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: META_DEFAULTS.title,
    description: META_DEFAULTS.description,
    type: 'website',
    locale: 'en_US',
    siteName: ORG.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: META_DEFAULTS.title,
    description: META_DEFAULTS.description,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-charcoal text-cream-100 antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1" id="main-content">
            {children}
          </main>
          <Footer />
          <QuickExit />
        </div>
      </body>
    </html>
  );
}
