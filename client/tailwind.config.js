/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0f172a",
        gold: "#fbbf24",
        slate: "#f8fafc",
        emergency: "#d90429",
        success: "#38b000"
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
      },
      boxShadow: {
        'luxury': '0 10px 40px rgba(15, 23, 42, 0.08)',
        'gold-glow': '0 0 20px rgba(251, 191, 36, 0.2)',
      }
    }
  },
  plugins: []
};
