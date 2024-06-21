// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./index.html', '../beta-cvi-ui/src/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  important: '#root',
  theme: {
    screens: {
      xs: '360px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        ...defaultTheme.colors,
        dark: {
          100: '#182f5d',
          200: '#0f122d',
          300: '#222540',
          400: '#2f3250',
          600: '#1b1d38',
          700: '#0f112d',
          800: '#03070f',
        },
        common: {
          orange: '#fea716',
          turquoise: '#2bdec1',
          lightRed: '#f96a9a',
          blue: '#2b387c',
          lightGreen: '#2bbede',
          cancel: '#2f3250',
          red: '#bb1e52',
        },
        modal: { borderBP: '#007acb', closeBtn: '#264fa1' },
        table: { firstTrOdd: '#1a2243', spinner: '#10bfa0' },
        alerts: { background: '#141741' },
      },
      fontSize: {
        xt: '.575rem',
        tiny: '.675rem',
        xs: '.75rem',
        sm: '.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
        '7xl': '5rem',
      },
    },
  },
  variants: {
    extend: {},
  },
}
