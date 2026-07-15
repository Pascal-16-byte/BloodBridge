/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#B71C1C',
        secondary: '#E53935',
        accent: '#FFCDD2',
        surface: '#FFF8F8',
        text: '#2C2C2C',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 25px 60px -20px rgba(183, 28, 28, 0.25)',
        soft: '0 18px 40px rgba(116, 29, 29, 0.12)',
      },
      backgroundImage: {
        'hero-fade':
          'linear-gradient(180deg, rgba(76, 9, 9, 0.68) 0%, rgba(92, 14, 14, 0.62) 45%, rgba(255, 248, 248, 0.12) 100%)',
        mesh:
          'radial-gradient(circle at top left, rgba(255,205,210,0.95), transparent 34%), radial-gradient(circle at bottom right, rgba(229,57,53,0.14), transparent 28%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'scale(1.07) translate3d(0, 0, 0)' },
          '50%': { transform: 'scale(1.11) translate3d(0, -12px, 0)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-18px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-5px)' },
          '40%': { transform: 'translateX(5px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pop: {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        float: 'float 18s ease-in-out infinite',
        wave: 'wave 9s ease-in-out infinite',
        shake: 'shake 0.35s ease-in-out',
        shimmer: 'shimmer 1.8s linear infinite',
        pop: 'pop 0.45s ease-out',
      },
    },
  },
  plugins: [],
};
