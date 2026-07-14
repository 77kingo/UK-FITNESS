/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          neon: '#ccff00',      // Electric Volt
          dark: '#0c0c0e',      // Pitch Black background
          card: '#16161a',      // Glass/solid card background
          accent: '#1e1e24',    // Dark grey highlight
          gold: '#d4af37',      // Secondary accent (optional)
        },
        grey: {
          900: '#121214',
          800: '#1a1a1e',
          700: '#2c2c35',
          400: '#a1a1aa',
          300: '#d4d4d8',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-glow': '0 0 15px rgba(204, 255, 0, 0.4)',
        'neon-border': '0 0 2px rgba(204, 255, 0, 0.8)',
      }
    },
  },
  plugins: [],
}
