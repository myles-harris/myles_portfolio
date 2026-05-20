/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        marigold: '#f6bf10',
        wheat:    '#e2c48d',
        saddle:   '#a67c52',
        espresso: '#3a2c1a',
        cream:    '#fff8e7',
      },
      keyframes: {
        tickerH: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        tickerV: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' }
        }
      },
      animation: {
        'tickerH': 'tickerH 30s linear infinite',
        'tickerV': 'tickerV 30s linear infinite'
      }
    },
  },
  plugins: [],
} 