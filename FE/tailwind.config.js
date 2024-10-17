/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: {
      transitionProperty: {
        'transform': 'transform',
      },
    },
  },
  variants: {
    extend: {
      transform: ['responsive', 'hover', 'focus'],
    },
  },
  plugins: [],
};
