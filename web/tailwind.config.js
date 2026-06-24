/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 五行主题色
        ink: {
          50: '#F5F1E8',
          100: '#E8E0D0',
          200: '#D6C9B0',
          300: '#B8A77A',
          400: '#6B5C3E',
          500: '#4A3E2A',
          600: '#2C2416',
        },
        teal: {
          50: '#E6F0F2',
          100: '#C2DBE0',
          200: '#8FB6BF',
          300: '#5A8E9A',
          400: '#3A6E7C',
          500: '#1A4D5C',
          600: '#143E4A',
          700: '#0F2F38',
          800: '#0A2026',
          900: '#061418',
        },
        amber: {
          50: '#FBF5E7',
          100: '#F5E5BC',
          200: '#EFD58E',
          300: '#E8C463',
          400: '#D4A84B',
          500: '#B8902F',
          600: '#967724',
          700: '#745C1A',
          800: '#524110',
        },
        cinnabar: {
          50: '#FBEDE9',
          100: '#F4CFC4',
          200: '#EAA998',
          300: '#DF836B',
          400: '#C8553D',
          500: '#A6412C',
          600: '#7F3222',
          700: '#5A2418',
        },
        // 五行代表色
        wuxing: {
          wood: '#5A8E4A',  // 木 - 青绿
          fire: '#C8553D',  // 火 - 朱红
          earth: '#D4A84B', // 土 - 琥珀
          metal: '#C9B87A', // 金 - 麦黄
          water: '#3A6E7C', // 水 - 玄青
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', 'serif'],
        sans: ['"Noto Sans SC"', '"Source Han Sans SC"', 'system-ui', 'sans-serif'],
        display: ['"Ma Shan Zheng"', '"Noto Serif SC"', 'serif'],
      },
      boxShadow: {
        ink: '0 2px 8px rgba(44, 36, 22, 0.06), 0 4px 16px rgba(44, 36, 22, 0.08)',
        'ink-lg': '0 4px 16px rgba(44, 36, 22, 0.08), 0 8px 32px rgba(44, 36, 22, 0.12)',
        'ink-xl': '0 8px 32px rgba(26, 77, 92, 0.12), 0 16px 64px rgba(26, 77, 92, 0.16)',
      },
      backgroundImage: {
        'ink-gradient': 'linear-gradient(135deg, #1A4D5C 0%, #3A6E7C 50%, #D4A84B 100%)',
        'rice-paper': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' /%3E%3CfeColorMatrix values='0 0 0 0 0.2 0 0 0 0 0.18 0 0 0 0 0.1 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
