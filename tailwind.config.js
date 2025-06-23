module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}','./components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        retro: '6px 6px 0px #000',
        neon: '0 0 15px rgba(255 5 111/.5)',
      },
      colors: {
        primary: { DEFAULT: '#FFF538', hover: '#FFE600', focus: '#FFE600' },
        secondary: { DEFAULT: '#FF006F', hover: '#E0005F', focus: '#E0005F' },
        accent: { DEFAULT: '#00D1FF', hover: '#00B8E0', focus: '#00B8E0' },
        neutral: { DEFAULT: '#F5F5F5', 100: '#FFFFFF', 200: '#F9F9F9', 300: '#F0F0F0', 400: '#E0E0E0', 500: '#C0C0C0', 600: '#808080', 700: '#606060', 800: '#404040', 900: '#202020' },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      { adspy: {
        primary: '#FFF538',
        secondary: '#FF006F',
        accent: '#00D1FF',
        neutral: '#191D24',
        'base-100': '#FFFFFF',
        info: '#3ABFF8',
        success: '#22C55E',
        warning: '#FBBD23',
        error: '#EF4444',
      } }
    ],
  },
}; 