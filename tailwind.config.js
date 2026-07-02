/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ios: {
          blue: '#2563EB',
          green: '#10B981',
          orange: '#FF9500',
          pink: '#FF2D55',
          purple: '#AF52DE',
          red: '#FF3B30',
          yellow: '#FFCC00',
          teal: '#5AC8FA',
        },
        surface: {
          DEFAULT: '#F2F2F7',
          dark: '#000000',
        },
        card: {
          DEFAULT: '#FFFFFF',
          dark: '#1C1C1E',
        },
        border: {
          DEFAULT: '#E5E5EA',
          dark: '#2C2C2E',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'sans-serif'],
      },
      borderRadius: {
        'xl2': '18px',
        'xl3': '20px',
      },
    },
  },
  plugins: [],
}
