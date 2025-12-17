/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-navy': '#0B1120',
        'brand-blue': '#1e3a8a',
        'brand-accent': '#3b82f6',
        'brand-green': '#059669',
        'paper': '#F8FAFC',
      },
    },
  },
  plugins: [],
}


