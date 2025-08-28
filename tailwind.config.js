/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        sparkle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '25%': { transform: 'scale(1.3)', opacity: '0.6' },
          '50%': { transform: 'scale(0.9)', opacity: '0.8' },
          '75%': { transform: 'scale(1.1)', opacity: '0.7' },
        },
      },
      animation: {
        sparkle: 'sparkle 0.8s ease-in-out',
      },
    },
  },
  plugins: [],
}

