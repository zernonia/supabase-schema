module.exports = {
  theme: {
    extend: {
      colors: {
        'dark-900': '#181818',
        'dark-800': '#1e1e1e',
        'dark-700': '#1f1f1f',
        'dark-600': '#2a2a2a',
        'dark-500': '#3f3f3f',
        'dark-border': '#232323',
        'white-700': '#e0e0e0',
        'white-800': '#b4b4b4',
        'white-900': '#878787',
      },
    },
  },
  plugins: [
    require('windicss/plugin/typography'),
    require('windicss/plugin/forms'),
  ],
}
