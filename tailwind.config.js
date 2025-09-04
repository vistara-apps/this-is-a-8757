/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsla(210, 25%, 95%, 1)',
        accent: 'hsla(312, 80%, 58%, 1)',
        primary: 'hsla(210, 87%, 47%, 1)',
        surface: 'hsla(0, 0%, 100%, 1)',
        'text-primary': 'hsla(214, 7%, 27%, 1)',
        'text-secondary': 'hsla(210, 10%, 56%, 1)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'xxl': '32px',
      },
      boxShadow: {
        'card': '0 4px 16px hsla(214, 7%, 27%, 0.08)',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
      transitionTimingFunction: {
        'custom': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'fast': '100ms',
        'base': '200ms',
        'slow': '300ms',
      }
    },
  },
  plugins: [],
}
