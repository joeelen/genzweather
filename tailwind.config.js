/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'neo': '4px 4px 0px 0px #000000',
        'neo-sm': '2px 2px 0px 0px #000000',
        'neo-lg': '6px 6px 0px 0px #000000',
      },
      borderWidth: {
        '3': '3px',
      },
      colors: {
        vibe: {
          butter: '#FEF08A',
          peach: '#FDBA74',
          lavender: '#DDD6FE',
          mist: '#BAE6FD',
          frost: '#A5F3FC',
          cherry: '#FDA4AF',
          matcha: '#A7F3D0',
          electric: '#A855F7',
          acid: '#BEF264',
        }
      }
    },
  },
  plugins: [],
}
