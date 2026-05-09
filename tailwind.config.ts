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
        // ============================================
        // NEW BRAND SYSTEM - "Forged from hardship into hope"
        // ============================================
        
        // PRIMARY: Forge Teal Family
        forge: {
          DEFAULT: '#1E6B73',
          50: '#F0F7F7',
          100: '#D4E8E9',
          200: '#B8D9DB',
          300: '#8FC0C3',
          400: '#5FA0A5',
          500: '#3D858B',
          600: '#1E6B73',  // Primary brand color
          700: '#18565C',
          800: '#0F4F57',  // Deep Flame Teal
          900: '#0A3A40',
          950: '#052629',
        },
        
        // WARM ACCENTS: Burnished Bronze & Walnut
        bronze: {
          DEFAULT: '#8B5E3C',
          50: '#F9F6F3',
          100: '#EDE4DB',
          200: '#DECCB8',
          300: '#CBAE8E',
          400: '#B88A6E',
          500: '#8B5E3C',  // Burnished Bronze
          600: '#6E4B3A',  // Ember Brown
          700: '#5B3A29',  // Warm Walnut
          800: '#4A2F22',
          900: '#382319',
        },
        
        // NEUTRALS: Warm & Inviting
        warm: {
          ivory: '#FAF7F2',      // Warm Ivory
          cream: '#F6F2EC',      // Soft Cream
          sand: '#D8CBBE',       // Muted Sand
          stone: '#A89B8C',      // Warm Stone
          earth: '#6B5D4D',      // Earth Brown
        },
        
        // SPECIAL HIGHLIGHTS
        highlight: {
          gold: '#C8A46B',       // Soft Gold Highlight
          rose: '#B88A7A',       // Gentle Rose Clay
          amber: '#D4A574',      // Warm Amber
        },
        
        // UTILITY: Charcoal for text
        charcoal: {
          DEFAULT: '#1F1F1F',
          50: '#F5F5F5',
          100: '#E5E5E5',
          200: '#D4D4D4',
          300: '#A3A3A3',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#2D2D2D',
          800: '#1F1F1F',  // Main text
          900: '#141414',
        },
        
        // LEGACY COMPATIBILITY (mapped to new system)
        ember: {
          DEFAULT: '#1E6B73',
          50: '#F0F7F7',
          100: '#D4E8E9',
          200: '#B8D9DB',
          300: '#8FC0C3',
          400: '#5FA0A5',
          500: '#3D858B',
          600: '#1E6B73',
          700: '#18565C',
          800: '#0F4F57',
          900: '#0A3A40',
        },
        flame: {
          DEFAULT: '#3D858B',
          light: '#5FA0A5',
          dark: '#18565C',
          soft: '#B8D9DB',
        },
        healing: {
          DEFAULT: '#8B5E3C',
          50: '#F9F6F3',
          100: '#EDE4DB',
          200: '#DECCB8',
          300: '#CBAE8E',
          400: '#B88A6E',
          500: '#8B5E3C',
          600: '#6E4B3A',
          700: '#5B3A29',
          800: '#4A2F22',
          900: '#382319',
        },
        cream: {
          DEFAULT: '#FAF7F2',
          50: '#FFFFFF',
          100: '#FAF7F2',
          200: '#F6F2EC',
          300: '#EDE4DB',
          warm: '#FDF8F6',
        },
        steel: {
          DEFAULT: '#6B5D4D',
          50: '#F9F6F3',
          100: '#EDE4DB',
          200: '#D8CBBE',
          300: '#C4B5A5',
          400: '#A89B8C',
          500: '#8B7D6D',
          600: '#6B5D4D',
          700: '#52463B',
          800: '#3D352C',
          900: '#28241E',
        },
        teal: {
          DEFAULT: '#1E6B73',
          50: '#F0F7F7',
          100: '#D4E8E9',
          200: '#B8D9DB',
          300: '#8FC0C3',
          400: '#5FA0A5',
          500: '#3D858B',
          600: '#1E6B73',
          700: '#18565C',
          800: '#0F4F57',
          900: '#0A3A40',
          950: '#052629',
          deep: '#0F4F57',
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
        // Brand gradients
        'forge-glow': 'linear-gradient(135deg, rgba(30, 107, 115, 0.08) 0%, rgba(61, 133, 139, 0.03) 50%, transparent 100%)',
        'bronze-glow': 'linear-gradient(135deg, rgba(139, 94, 60, 0.08) 0%, rgba(184, 138, 110, 0.03) 50%, transparent 100%)',
        'warm-ivory': 'linear-gradient(180deg, #FAF7F2 0%, #F6F2EC 100%)',
        'forge-radial': 'radial-gradient(circle at 50% 50%, rgba(30, 107, 115, 0.06) 0%, transparent 70%)',
        'ember-ambient': 'radial-gradient(ellipse at 30% 20%, rgba(139, 94, 60, 0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(30, 107, 115, 0.04) 0%, transparent 50%)',
      },
      boxShadow: {
        'forge': '0 0 40px rgba(30, 107, 115, 0.15)',
        'forge-sm': '0 0 20px rgba(30, 107, 115, 0.1)',
        'bronze': '0 0 40px rgba(139, 94, 60, 0.12)',
        'warm': '0 4px 20px rgba(107, 93, 77, 0.06)',
        'warm-lg': '0 8px 40px rgba(107, 93, 77, 0.08)',
        'card': '0 2px 12px rgba(30, 107, 115, 0.06)',
        'card-hover': '0 8px 30px rgba(30, 107, 115, 0.1)',
        'soft': '0 4px 20px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 8px 40px rgba(0, 0, 0, 0.06)',
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
