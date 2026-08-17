/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0A0A0C',
          dark: '#050506',
          card: '#120F13',
          border: '#261F28',
          light: '#1B161D',
        },
        emerald: {
          dark: '#0A0A0C',
          card: '#120F13',
          border: '#261F28',
          light: '#1B161D',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F5D77F',
          muted: '#C5A030',
          dark: '#9A7B1C',
        },
        saffron: {
          DEFAULT: '#FF9E3B',
          light: '#FFAA54',
          dark: '#D97706',
        },
        copper: {
          DEFAULT: '#8B4513',
          light: '#A0522D',
          dark: '#5C2D0C',
        }
      },
      fontFamily: {
        serif: ['var(--font-cinzel)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
