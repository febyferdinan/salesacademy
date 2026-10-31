/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', '"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        la: {
          navy: '#0B1A33',
          navy2: '#13264A',
          blue: '#0B6FD0',
          bluePress: '#0959A8',
          sky: '#39A3FF',
          ice: '#EAF3FD',
          canvas: '#F4F8FD',
          amber: '#F5A524',
          amberSoft: '#FEF4E2',
          green: '#12924F',
          greenSoft: '#E5F6EC',
          red: '#D33B3B',
          redSoft: '#FDECEC',
        },
      },
      boxShadow: {
        brand: '0 10px 32px -6px rgba(11, 111, 208, 0.35)',
        'brand-lg': '0 20px 50px -10px rgba(11, 111, 208, 0.45)',
        card: '0 4px 20px -2px rgba(11, 26, 51, 0.05)',
        'card-hover': '0 12px 32px -4px rgba(11, 26, 51, 0.1)',
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '26px',
      },
    },
  },
  plugins: [],
};

