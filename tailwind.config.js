module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      'my-theme-1': '#2b2d42',
      'my-theme-2': '#8d99ae',
      'my-theme-3': '#edf2f4',
      'my-theme-4': '#ef233c',
      'my-theme-5': '#d90429',
    },
    fontFamily: {
      'sans': ['"Bree Serif"', 'serif'],
    },
    boxShadow: {
      'inner': 'inset 0 -30px 30px -30px rgba(0, 0, 0, 0.3)',
      'footer': '0 30px 50px 30px rgba(0, 0, 0, 0.7)',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
