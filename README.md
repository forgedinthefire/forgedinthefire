# Forged in the Fire

A premium, trauma-informed nonprofit website for survivors of commercial sex trafficking.

## Overview

**Forged in the Fire** is a survivor-centered nonprofit organization dedicated to empowering survivors of commercial sex trafficking through safe housing, trauma-informed care, and holistic support services that foster healing, independence, and hope.

This website is built with:
- **Next.js 15** - React framework for production
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **ShadCN/UI** - Re-usable components
- **Lucide React** - Icon library

## Key Features

### Trauma-Informed Design
- Calming, non-triggering visual design
- No sensationalism or exploitative imagery
- Emphasis on resilience, dignity, and hope
- Soft animations and gentle transitions

### Survivor Safety
- **Quick Exit Button** - Instantly redirects to weather.com
- Keyboard shortcut (Ctrl+Escape) for immediate exit
- History clearing functionality
- Discreet, survivor-centered language

### Accessibility (WCAG AA)
- Full keyboard navigation support
- Screen reader optimization
- High contrast support
- Reduced motion support
- Semantic HTML structure
- ARIA labels and roles

### Comprehensive Services
- Victim Advocacy
- Workforce Development
- Survivor Mentorship
- Community Education
- Offender Accountability
- Housing & Reintegration
- Counseling & Trauma Recovery

## Project Structure

```
forged-in-the-fire/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── about/             # About page
│   ├── services/          # Services hub
│   ├── get-help/          # Crisis support
│   ├── donate/            # Donation page
│   ├── volunteer/         # Volunteer signup
│   ├── resources/         # Education resources
│   ├── contact/           # Contact page
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # UI components (ShadCN)
│   ├── navbar.tsx        # Navigation
│   ├── footer.tsx        # Footer
│   └── quick-exit.tsx    # Safety feature
├── lib/                  # Utilities and constants
│   ├── utils.ts          # Helper functions
│   └── constants.ts      # Organization data
├── public/               # Static assets
├── content/              # CMS content (optional)
├── tailwind.config.ts    # Tailwind configuration
├── next.config.ts        # Next.js configuration
└── package.json          # Dependencies
```

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd forged-in-the-fire
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your values
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://forgedinthefire.org
NEXT_PUBLIC_SITE_NAME=Forged in the Fire

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=contact@forgedinthefire.org
RESEND_TO_EMAIL=help@forgedinthefire.org

# Stripe Payments
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx

# Analytics (Plausible)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=forgedinthefire.org

# Security
TURNSTILE_SECRET_KEY=0x4xxxxxxxxxxxxxxxx
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4xxxxxxxxxxxxxxxx
```

## Build and Deploy

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

### Deploy to Vercel:
```bash
npm install -g vercel
vercel --prod
```

## Design System

### Colors
- **Deep Charcoal** `#111111` - Primary background
- **Soft Ember** `#D97706` - Primary accent
- **Warm Gold** `#F59E0B` - Secondary accent
- **Healing Teal** `#0F766E` - Trust/health accent
- **Soft Cream** `#FAF7F2` - Primary text
- **Steel Gray** `#374151` - Secondary text

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Animation Guidelines
- Slow, calm motion (300-600ms transitions)
- Soft fade reveals
- Gentle hover states
- Reduced motion support via `prefers-reduced-motion`

## Safety Features

### Quick Exit
Every page includes a floating "Quick Exit" button that:
- Redirects instantly to weather.com
- Clears local and session storage
- Attempts to clear browser history
- Can be triggered via Ctrl+Escape keyboard shortcut

### Privacy Considerations
- Minimal data collection
- Encrypted form submissions
- Anonymous resource access where possible
- No location exposure

## Accessibility Compliance

This site meets **WCAG 2.1 Level AA** standards:
- All interactive elements are keyboard accessible
- Proper heading hierarchy (h1 → h6)
- Alt text for all images
- ARIA labels for icons and buttons
- Focus indicators visible
- Color contrast ratios ≥ 4.5:1
- Reduced motion support

## Content Guidelines

All content follows trauma-informed principles:
- Survivor-centered language
- Dignity-focused messaging
- No sensationalism
- Empowerment over victimization
- Hope and resilience emphasized
- Clear, jargon-free communication

## API Endpoints

### POST /api/contact
Submit contact form. Requires:
- `email` (string, valid email)
- `message` (string, min 10 chars)
- Optional: `name`, `phone`, `subject`, `isSurvivor`

### POST /api/volunteer
Submit volunteer application. Requires:
- `name` (string, min 2 chars)
- `email` (string, valid email)
- `role` (string)
- `message` (string, min 20 chars)

## Contributing

1. Follow the existing code style
2. Ensure accessibility standards are met
3. Test with keyboard navigation
4. Verify reduced motion support
5. Maintain trauma-informed content standards

## License

This project is proprietary and confidential. All rights reserved.

## Support

For technical support, contact the development team.
For organization inquiries, use the contact form on the website.

---

**Forged in the Fire** - Empowering survivors. Restoring hope.
