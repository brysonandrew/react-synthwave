/** @type {import('tailwindcss').Config} */
const { join } = require("path");
module.exports = {
  content: [
    join(__dirname, "./dev/**/*.ts"),
    join(__dirname, "./dev/**/*.tsx"),
  ],
  theme: {
    extend: {
      width: {
        core: "512px"
      }
    },
  },
};
