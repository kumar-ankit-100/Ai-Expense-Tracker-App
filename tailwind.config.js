/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F0FF',
          100: '#CCE1FF',
          200: '#99C3FF',
          300: '#66A5FF',
          400: '#3387FF',
          500: '#0069FF',
          600: '#0054CC',
          700: '#003F99',
          800: '#002A66',
          900: '#001533',
        },
        dark: {
          50: '#1A1F3A',
          100: '#151A30',
          200: '#101426',
          300: '#0C0F1D',
          400: '#0A0E27',
          500: '#080B1E',
          600: '#060914',
          700: '#04060D',
          800: '#020307',
          900: '#000000',
        },
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        income: '#10B981',
        expense: '#EF4444',
      },
      fontFamily: {
        regular: ['System'],
        medium: ['System'],
        semibold: ['System'],
        bold: ['System'],
      }
    },
  },
  plugins: [],
}
