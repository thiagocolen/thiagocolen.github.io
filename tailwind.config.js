const colors = require('./node_modules/tailwindcss/colors');

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      head: ['"Archivo Black"', 'sans-serif'],
      sans: ['"Space Grotesk"', 'sans-serif'],
    },
    extend: {
      colors: {
        background: '#F5ECE7',
        foreground: '#000000',
        primary: {
          DEFAULT: '#ffdb33',
          hover: '#ffcc00',
          foreground: '#000000',
        },
        secondary: {
          DEFAULT: '#000000',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#aeaeae',
          foreground: '#5a5a5a',
        },
        accent: {
          DEFAULT: '#fae583',
          foreground: '#000000',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#000000',
        },
        border: '#000000',
        // Retain original colors for compatibility if needed
        rose: colors.rose,
        fuchsia: colors.fuchsia,
        indigo: colors.indigo,
        teal: colors.teal,
        lime: colors.lime,
        orange: colors.orange,
        amber: colors.amber,
        emerald: colors.emerald,
        cyan: colors.cyan,
        sky: colors.sky,
        violet: colors.violet,
      },
      boxShadow: {
        xs: '1px 1px 0 0 #000000',
        sm: '2px 2px 0 0 #000000',
        DEFAULT: '3px 3px 0 0 #000000',
        md: '4px 4px 0 0 #000000',
        lg: '6px 6px 0 0 #000000',
        xl: '10px 10px 0 1px #000000',
        '2xl': '16px 16px 0 1px #000000',
      },
    },
  },
  variants: {
    extend: {
      translate: ['active'],
      boxShadow: ['active'],
    },
  },
  plugins: [],
};
