/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dg-grey-dark": "#756F86",
        "dg-red": "#FF7171",
        "dg-black": "#2C2738",
        "dg-blue": "#3C6DB2",
        "dg-blue-light": "#CEDBEC",
        "dg-green": "#14A38B",
        "dg-yellow": "#F2D957",
        "dg-blue-light2": "#EBF4F8",
        "text-color-semibold": "#4B465C",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
