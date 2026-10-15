/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0284c7',
          dark: '#0369a1',
          light: '#38bdf8',
          container: '#007bb9',
          fixed: '#cce5ff',
          'fixed-dim': '#93ccff',
        },
        secondary: {
          DEFAULT: '#0f52ba',
          dark: '#0c4194',
          light: '#6292fd',
          fixed: '#d9e2ff',
          'fixed-dim': '#b0c6ff',
        },
        tertiary: {
          DEFAULT: '#06b6d4',
          container: '#008096',
          fixed: '#acedff',
          'fixed-dim': '#4cd7f6',
        },
        surface: {
          DEFAULT: '#ffffff',
          dim: '#d2d9f4',
          bright: '#faf8ff',
          variant: '#dae2fd',
          container: '#eaedff',
          'container-lowest': '#ffffff',
          'container-low': '#f8fafc',
          'container-high': '#e2e7ff',
          'container-highest': '#dae2fd',
        },
        'on-surface': '#0f172a',
        'on-surface-variant': '#475569',
        'inverse-surface': '#0f172a',
        'inverse-on-surface': '#f8fafc',
        outline: '#707881',
        'outline-variant': '#cbd5e1',
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        'brand-navy': '#0f172a',
        'brand-blue': '#0284c7',
        'ice-blue': '#f0f6fa',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(15, 82, 186, 0.08)',
        hover: '0 12px 32px -4px rgba(15, 82, 186, 0.12)',
        modal: '0 24px 48px -8px rgba(15, 23, 42, 0.18)',
      },
    },
  },
  plugins: [],
}
