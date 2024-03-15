/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '/views/*.ejs',
    '/public/javascripts/*.js',
    '/routes/*.js'
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
}

