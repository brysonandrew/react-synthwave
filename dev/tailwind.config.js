/** @type {import('tailwindcss').Config} */
const { join } = require("path");
module.exports = {
  content: [
    join(__dirname, "./**/*.ts"),
    join(__dirname, "./**/*.tsx"),
  ],
  theme: {
    extend: {
      width: {
        core: "512px"
      }
    },
  },
};
