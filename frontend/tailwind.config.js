/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brain: {
          dark:   '#050b1a',
          panel:  '#0d1b2e',
          border: '#1e3a5f',
          accent: '#38bdf8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'glow':       'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          from: { boxShadow: '0 0 8px #38bdf8' },
          to:   { boxShadow: '0 0 24px #38bdf8, 0 0 48px #38bdf880' },
        },
      },
    },
  },
  plugins: [],
};

