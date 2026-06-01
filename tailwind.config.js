/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif"', 'Georgia', 'serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Brand AGCO / PHTRE
        agco: { red: '#c8102e' },
        brand: {
          blue: '#1b3a8c',
          'blue-deep': '#15306f',
          green: '#2e7d32',
          amber: '#b26a00',
          header: '#16202e',
          'header-2': '#1c2838',
        },
        podium: { gold: '#e8b53a', silver: '#c2cad6', bronze: '#d68a4e' },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'elev-sm': '0 1px 2px rgba(21,24,29,0.05), 0 2px 6px rgba(21,24,29,0.05)',
        'elev-md': '0 2px 4px rgba(21,24,29,0.05), 0 10px 26px rgba(21,24,29,0.09)',
        'elev-lg': '0 8px 16px rgba(21,24,29,0.08), 0 24px 56px rgba(21,24,29,0.14)',
      },
      backgroundImage: {
        'grad-blue': 'linear-gradient(145deg, #21459c 0%, #1b3a8c 55%, #15306f 100%)',
        'grad-header': 'linear-gradient(160deg, #1c2838 0%, #16202e 70%, #111a26 100%)',
      },
      keyframes: {
        'opt-in': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'none' } },
        rise: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'none' } },
        pop: { '0%': { transform: 'scale(0.6)' }, '60%': { transform: 'scale(1.12)' }, '100%': { transform: 'scale(1)' } },
        'splash-rise': { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'none' } },
        'splash-out': { from: { opacity: '1' }, to: { opacity: '0', visibility: 'hidden' } },
        'flash-new': { '0%,30%': { background: 'rgba(52,208,88,0.28)' }, '100%': { background: 'transparent' } },
        'live-pulse': { '0%': { boxShadow: '0 0 0 0 rgba(52,208,88,0.6)' }, '70%': { boxShadow: '0 0 0 10px rgba(52,208,88,0)' }, '100%': { boxShadow: '0 0 0 0 rgba(52,208,88,0)' } },
      },
      animation: {
        'opt-in': 'opt-in 0.4s cubic-bezier(0.16,1,0.3,1) backwards',
        rise: 'rise 0.35s cubic-bezier(0.2,0.7,0.2,1)',
        pop: 'pop 0.32s cubic-bezier(0.16,1,0.3,1)',
        'splash-rise': 'splash-rise 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'splash-out': 'splash-out 0.6s cubic-bezier(0.2,0.7,0.2,1) forwards',
        'flash-new': 'flash-new 2.2s cubic-bezier(0.2,0.7,0.2,1)',
        'live-pulse': 'live-pulse 1.8s infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
