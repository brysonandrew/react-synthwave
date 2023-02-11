/** @type {import('tailwindcss').Config} */
const { join } = require("path");
module.exports = {
  content: [
    join(__dirname, "./src/**/*.ts"),
    join(__dirname, "./src/**/*.tsx"),
  ],
  theme: {
    extend: {},
  },
};
