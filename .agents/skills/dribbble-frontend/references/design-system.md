# Design System Reference

## Tailwind Config (tailwind.config.js)

```javascript
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Plus Jakarta Sans', ...fontFamily.sans],
        body:    ['DM Sans', ...fontFamily.sans],
        mono:    ['JetBrains Mono', ...fontFamily.mono],
      },
      colors: {
        neutral: {
          0:   '#FFFFFF', 50:  '#F8FAFC', 100: '#F1F5F9',
          200: '#E2E8F0', 300: '#CBD5E1', 400: '#94A3B8',
          500: '#64748B', 600: '#475569', 700: '#334155',
          800: '#1E293B', 900: '#0F172A', 950: '#020617',
        },
        brand: {
          50:  '#F5F3FF', 100: '#EDE9FE', 200: '#DDD6FE',
          300: '#C4B5FD', 400: '#A78BFA', 500: '#8B5CF6',
          600: '#7C3AED', 700: '#6D28D9', 800: '#5B21B6',
          900: '#4C1D95', 950: '#2E1065',
        },
        accent: {
          coral: '#FF6B6B',
          amber: '#FFB347',
          mint:  '#4ECDC4',
          sky:   '#45B7D1',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error:   '#EF4444',
        info:    '#3B82F6',
      },
      spacing: {
        '4.5': '18px', '18': '72px', '22': '88px',
        '26':  '104px', '30': '120px', '34': '136px', '38': '152px',
      },
      borderRadius: {
        'xs': '2px', 'sm': '4px', 'md': '8px', 'lg': '12px',
        'xl': '16px', '2xl': '20px', '3xl': '24px', '4xl': '32px',
      },
      boxShadow: {
        'xs':        '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'brand':     '0 8px 32px -4px rgb(139 92 246 / 0.4)',
        'brand-lg':  '0 20px 60px -8px rgb(139 92 246 / 0.5)',
        'glow':      '0 0 20px rgb(139 92 246 / 0.3)',
        'glow-lg':   '0 0 60px rgb(139 92 246 / 0.25)',
        'inner-sm':  'inset 0 1px 4px 0 rgb(0 0 0 / 0.06)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};
```

---

## CSS Variables (globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --bg-primary:     theme('colors.white');
    --bg-secondary:   theme('colors.neutral.50');
    --bg-tertiary:    theme('colors.neutral.100');
    --text-primary:   theme('colors.neutral.900');
    --text-secondary: theme('colors.neutral.500');
    --text-tertiary:  theme('colors.neutral.400');
    --border:         theme('colors.neutral.100');
    --border-strong:  theme('colors.neutral.200');
    --brand:          theme('colors.brand.500');
  }

  .dark {
    --bg-primary:     theme('colors.neutral.950');
    --bg-secondary:   theme('colors.neutral.900');
    --bg-tertiary:    theme('colors.neutral.800');
    --text-primary:   theme('colors.neutral.50');
    --text-secondary: theme('colors.neutral.400');
    --text-tertiary:  theme('colors.neutral.500');
    --border:         theme('colors.neutral.800');
    --border-strong:  theme('colors.neutral.700');
    --brand:          theme('colors.brand.400');
  }
}

@layer utilities {
  .glass {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }
  .glass-dark {
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }
  .gradient-text {
    background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #06B6D4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .noise::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.4;
  }
}
```

---

## Typography Scale

| Class | Size | Usage |
|---|---|---|
| `text-[11px]` | 11px | Labels, captions, badges |
| `text-sm` | 14px | Body small, metadata |
| `text-base` | 16px | Body main |
| `text-lg` | 18px | Lead text |
| `text-2xl` | 24px | Subheadings |
| `text-3xl` | 30px | Section headings |
| `text-4xl` | 36px | Page headings |
| `text-5xl–7xl` | 48–72px | Hero headlines (font-display, font-bold) |

## Layout Rules
- Container max-width: `max-w-7xl` (1280px) with `px-6 md:px-12`
- Section vertical padding: `py-20 md:py-32`
- Card grid gap: `gap-6` (24px)
- Sidebar width: `w-[260px]`

## Font Imports (in index.html or main.css)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&family=DM+Sans:wght@400;500&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
```
