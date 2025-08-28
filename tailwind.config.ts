import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xxl': '1300px',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        // Blue-based professional theme
        primary: {
          DEFAULT: '#3b82f6', // Blue-500 – approachable and official
          foreground: '#fff',
        },
        accent: {
          DEFAULT: '#38bdf8', // Sky-400 – softer action color
          foreground: '#0f172a',
        },
        background: '#f8fafc', // Slate-50 – near white with a bluish tint
        foreground: '#0f172a', // Slate-900 – main text color
        'bg-background': '#f8fafc',
        card: {
          DEFAULT: '#eff6ff', // Light blue background for contrast blocks
          foreground: '#334155', // Slate-700 – clean and readable
        },
        'bg-card': '#eff6ff',
        border: '#dbeafe', // Blue-100 – subtle section dividers
        heading: '#0f172a', // Slate-900 – strong contrast, elegant
        'text-heading': '#0f172a',
        body: '#334155', // Slate-700 – clean and readable
        'text-body': '#334155',
        link: '#2563eb', // Blue-600 – very visible and interactive
        'text-link': '#2563eb',
        info: {
          DEFAULT: '#e0f2fe', // Light info boxes with cyan-blue tones
          foreground: '#0f172a',
        },
        'bg-info': '#e0f2fe',
        white: '#fff',
        input: '#A8E6CF',
        ring: '#A8E6CF',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        // Optimized 60fps animations
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { 
            opacity: '0',
            transform: 'translate3d(0, 20px, 0)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translate3d(0, 0, 0)',
          },
        },
        'fade-in-down': {
          '0%': { 
            opacity: '0',
            transform: 'translate3d(0, -20px, 0)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translate3d(0, 0, 0)',
          },
        },
        'scale-in': {
          '0%': { 
            opacity: '0',
            transform: 'scale3d(0.95, 0.95, 1)',
          },
          '100%': { 
            opacity: '1',
            transform: 'scale3d(1, 1, 1)',
          },
        },
        'slide-in-left': {
          '0%': { 
            opacity: '0',
            transform: 'translate3d(-20px, 0, 0)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translate3d(0, 0, 0)',
          },
        },
        'slide-in-right': {
          '0%': { 
            opacity: '0',
            transform: 'translate3d(20px, 0, 0)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translate3d(0, 0, 0)',
          },
        },
        'bounce-subtle': {
          '0%, 100%': { 
            transform: 'translate3d(0, 0, 0)',
          },
          '50%': { 
            transform: 'translate3d(0, -4px, 0)',
          },
        },
        'heartbeat': {
          '0%, 100%': { 
            transform: 'scale3d(1, 1, 1)',
            filter: 'brightness(1)',
          },
          '14%': { 
            transform: 'scale3d(1.1, 1.1, 1)',
            filter: 'brightness(1.2)',
          },
          '28%': { 
            transform: 'scale3d(1, 1, 1)',
            filter: 'brightness(1)',
          },
          '42%': { 
            transform: 'scale3d(1.05, 1.05, 1)',
            filter: 'brightness(1.1)',
          },
          '70%': { 
            transform: 'scale3d(1, 1, 1)',
            filter: 'brightness(1)',
          },
        },
        'pulse-glow': {
          '0%': { 
            transform: 'scale3d(0.8, 0.8, 1)',
            opacity: '0.8',
          },
          '50%': { 
            transform: 'scale3d(1.4, 1.4, 1)',
            opacity: '0',
          },
          '100%': { 
            transform: 'scale3d(0.8, 0.8, 1)',
            opacity: '0.8',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'spin-slow': 'spin-slow 4s linear infinite',
        // Optimized 60fps animations
        'fade-in': 'fade-in 0.25s cubic-bezier(0.4, 0.0, 0.2, 1)',
        'fade-in-up': 'fade-in-up 0.25s cubic-bezier(0.4, 0.0, 0.2, 1)',
        'fade-in-down': 'fade-in-down 0.25s cubic-bezier(0.4, 0.0, 0.2, 1)',
        'scale-in': 'scale-in 0.25s cubic-bezier(0.4, 0.0, 0.2, 1)',
        'slide-in-left': 'slide-in-left 0.25s cubic-bezier(0.4, 0.0, 0.2, 1)',
        'slide-in-right': 'slide-in-right 0.25s cubic-bezier(0.4, 0.0, 0.2, 1)',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 1.2s ease-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
