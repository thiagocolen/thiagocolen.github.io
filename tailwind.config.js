const colors = require('./node_modules/tailwindcss/colors');

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      head: ['"Archivo Black"', 'sans-serif'],
      sans: ['"Space Grotesk"', 'sans-serif'],
      // Article typography: Bentham for titles/callouts, Domine for
      // everything that carries the reading weight. Domine tops out at 700,
      // so `font-bold` is its heaviest.
      bentham: ['Bentham', 'serif'],
      domine: ['Domine', 'serif'],
    },
    extend: {
      fontSize: {
        'nano': '0.375rem',    // 6px
        'micro': '0.4375rem',  // 7px
        'tiny': '0.5rem',      // 8px
        'xxs': '0.5625rem',    // 9px
        'xs-plus': '0.625rem', // 10px
      },
      height: {
        '40vh': '40vh',
        '60vh': '60vh',
      },
      spacing: {
        // 60% of the 2.75rem the fixed control buttons used to be. A named key
        // rather than '6.6' so the generated class needs no dot-escaping.
        control: '1.65rem',
      },
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
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s ease-out forwards',
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
