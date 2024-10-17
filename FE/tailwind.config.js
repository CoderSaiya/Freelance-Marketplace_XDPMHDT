/** @type {import('tailwindcss').Config} */
export default {
    mode: 'jit',
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
    theme: {
      extend: {
        transform: ['responsive', 'hover', 'focus'],
        transitionProperty: {
          'transform': 'transform',
        },
      },
    },
    plugins: [],
  };
  