// TODO: [OBS] tailwindcss have a problem with some colors, to more details:
// https://blog.montoulieu.dev/post/how-to-add-colors-from-the-new-color-palette-in-tailwindcss-v2-0
const colors = require('./node_modules/tailwindcss/colors');


// TODO: Shall we change fontFamily?
// "Apercu",-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'sans': ['"Besley"', 'serif'],
    },
    extend: {
      // TODO: [OBS] tailwindcss have a problem with some colors that needs to be imported
      colors: {
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
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
