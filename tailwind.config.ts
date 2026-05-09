import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors - Deep Teal System matching new logo
        charcoal: {
          DEFAULT: '#0D3D39',
          50: '#F0FDFC',
          100: '#CCFBF6',
          200: '#99F6ED',
          300: '#5EEADF',
          400: '#2DD4C4',
          500: '#14B8A8',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },
        // Primary Brand Color - Deep Teal from Logo
        ember: {
          DEFAULT: '#0D9488',
          50: '#F0FDFC',
          100: '#CCFBF6',
          200: '#99F6ED',
          300: '#5EEADF',
          400: '#2DD4C4',
          500: '#14B8A8',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        // Soft Teal Gradient Accents
        flame: {
          DEFAULT: '#14B8A8',
          light: '#2DD4C4',
          dark: '#0F766E',
          soft: '#99F6ED',
        },
        // Warm brown/amber accent - complements teal beautifully
        healing: {
          DEFAULT: '#92400E',
          50: '#FEF7F0',
          100: '#FEEBD6',
          200: '#FBD0A5',
          300: '#F5B06C',
          400: '#E88A3D',
          500: '#D97706',
          600: '#B45309',
          700: '#92400E',
          800: '#78350F',
          900: '#451A03',
        },
        // Clean White/Off-white System
        cream: {
          DEFAULT: '#FFFFFF',
          50: '#FFFFFF',
          100: '#FAFAFA',
          200: '#F5F5F5',
          300: '#E5E5E5',
          warm: '#FDF8F6',
        },
        // Soft Gray System
        steel: {
          DEFAULT: '#4B5563',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Deep Teal for backgrounds
        teal: {
          DEFAULT: '#0F766E',
          50: '#F0FDFC',
          100: '#CCFBF6',
          200: '#99F6ED',
          300: '#5EEADF',
          400: '#2DD4C4',
          500: '#14B8A8',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
          deep: '#0D3D39',
        },
        // ShadCN UI colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'ember-float': 'emberFloat 6s ease-in-out infinite',
        'slow-spin': 'spin 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        emberFloat: {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.6' },
          '50%': { transform: 'translateY(-10px) scale(1.05)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'teal-glow': 'linear-gradient(135deg, rgba(15, 118, 110, 0.08) 0%, rgba(20, 184, 166, 0.03) 50%, transparent 100%)',
        'soft-teal-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #F0FDFC 100%)',
        'teal-radial': 'radial-gradient(circle at 50% 50%, rgba(15, 118, 110, 0.05) 0%, transparent 70%)',
      },
      boxShadow: {
        'teal': '0 0 40px rgba(15, 118, 110, 0.2)',
        'teal-sm': '0 0 20px rgba(15, 118, 110, 0.15)',
        'glow': '0 0 60px rgba(20, 184, 166, 0.1)',
        'soft': '0 4px 20px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 8px 40px rgba(0, 0, 0, 0.08)',
        'card': '0 2px 12px rgba(15, 118, 110, 0.08)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1000': '1000ms',
      },
      transitionTimingFunction: {
        'calm': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'gentle': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
