const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        firstColor: "#10002B",
        secondColor: "#240046",
        thirdColor: "#3C096C",
        forthColor: "#5A189A",
        fiveColor: "#7b2cbf",
        sixColor: "#9d4edd",
        sevenColor: "#c77dff",
        eightColor: "#E0AAFF",
        nineColor: "#e6bbff",
        tenColor: "#ebc9ff",
        primary: "#202225",
        secondary: "#5865f2",
      },
    },
  },
  plugins: [],
};
