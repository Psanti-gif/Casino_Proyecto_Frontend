/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,mdx}',
    './components/**/*.{js,jsx,mdx}',
    './app/**/*.{js,jsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E50914',
          dark: '#B30710',
          light: '#FF3341'
        },
        secondary: {
          DEFAULT: '#FFD700',
          dark: '#B39700',
          light: '#FFEB80'
        },
        accent: {
          purple: '#9B59B6',
          blue: '#3498DB',
          green: '#2ECC71',
        },
        casino: {
          dark: '#0D1117',
          card: '#161B22',
          light: '#21262D',
          highlight: '#30363D'
        }
      },
      backgroundImage: {
        'hero-pattern': "url('/images/hero-bg.jpg')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.primary.DEFAULT"), 0 0 20px theme("colors.primary.light")',
        'neon-secondary': '0 0 5px theme("colors.secondary.DEFAULT"), 0 0 20px theme("colors.secondary.light")',
        'card': '0 0 15px rgba(0, 0, 0, 0.3)',
        'inner-glow': 'inset 0 0 10px rgba(229, 9, 20, 0.5)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shine': 'shine 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        shine: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' }
        }
      }
    },
  },
  plugins: [],
}