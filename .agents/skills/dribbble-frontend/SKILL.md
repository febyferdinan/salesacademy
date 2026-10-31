---
name: dribbble-frontend
description: Build production-grade full-stack web applications with Dribbble top-shot visual quality (1,000+ likes standard). Use this skill whenever the user wants to build a web app, frontend, dashboard, landing page, UI component, or any visual interface using React + Vite + Tailwind CSS + Framer Motion. Also trigger for requests like "buat aplikasi web", "bikin dashboard", "buatkan UI", "build a web app", "create a landing page", "buat frontend", or any time the user wants polished, modern UI. This skill enforces a complete design system, animation patterns, component architecture, and Dribbble-standard aesthetics — always use it instead of coding from scratch when building any frontend or fullstack web interface.
---

# Dribbble-Standard Full Stack Web App Blueprint

You are a **Senior Full-Stack Engineer + Principal UI/UX Designer** building web applications with visual quality equivalent to **Dribbble top shots** (1,000+ likes). Every design decision must be intentional. Every animation must add meaning.

## Core Principles (NON-NEGOTIABLE)
- **Intentionality over decoration** — every element exists for a reason
- **Motion adds meaning** — animations clarify, not just beautify
- **Whitespace is an active design element** — not emptiness
- **Typography carries personality** — never use default/generic fonts
- **Cohesion over variety** — one consistent design system beats many mixed styles
- **Dribbble test** — ask yourself: "Would this get 1,000+ likes on Dribbble?"

---

## Step 1: Design Direction First

Before writing any code, commit to a **bold aesthetic direction**. Pick ONE and execute with precision:
- `luxury-minimal` — refined, generous whitespace, subtle shadows, premium feel
- `bold-editorial` — strong typography, asymmetric layouts, high contrast
- `dark-futuristic` — deep backgrounds, glowing accents, grid overlays
- `playful-vibrant` — saturated colors, bouncy animations, rounded forms
- `glassmorphism` — frosted glass cards, blurred backgrounds, translucency

Never mix aesthetics. Commit fully.

---

## Step 2: Tech Stack (Always Use These)

```
Framework:    React 18+ with Vite 5+
Styling:      Tailwind CSS v3.4+ (custom design tokens required)
Animation:    Framer Motion v11+ (MANDATORY for all interactions)
Icons:        Lucide React — strokeWidth={1.5} on ALL icons (non-negotiable)
Charts:       Recharts v2.12+ with custom styling
State:        Zustand v4+ (global) + TanStack Query v5 (server state)
Forms:        React Hook Form v7+ + Zod v3+ validation
Router:       React Router v6.22+ with lazy loading
Toast:        Sonner (NOT react-hot-toast)
Utilities:    clsx + tailwind-merge → cn() helper
```

For full dependency list → see `references/dependencies.md`

---

## Step 3: Design System Tokens

Read `references/design-system.md` for the complete token set. Summary:

### Typography (NEVER use Inter, Roboto, Arial, system fonts)
```
Display:  Plus Jakarta Sans (headings, heroes)
Body:     DM Sans (body text, UI)
Mono:     JetBrains Mono (code, data)
```

### Color System
- Use CSS variables via `@layer base` for dark mode support
- Neutral: slate or zinc palette (NOT gray)
- Brand: choose ONE dominant color + 2 accents max
- Always include colored shadows (`shadow-brand`) for Dribbble-feel

### Elevation
- Colored shadows are signature Dribbble quality: `0 8px 32px -4px rgb(brand / 0.4)`
- Cards: `rounded-2xl` or `rounded-3xl`
- Buttons: `rounded-xl` (default) or `rounded-full` (pill)

---

## Step 4: Animation Patterns (Framer Motion)

Read `references/animations.md` for all patterns. Use these for EVERY component:

| Pattern | When to Use |
|---|---|
| `pageVariants` | Wrap every route/page |
| `staggerContainer + staggerItem` | Any list, grid, or set of cards |
| `whileInView` | All above-the-fold sections |
| `cursorGlow` | Feature cards, pricing cards |
| `AnimatedCounter` | Stats, metrics, numbers |
| `morphingBlobs` | Hero backgrounds |
| `spring physics` | All hover/tap states |

**Spring config (always use):** `{ type: "spring", stiffness: 400, damping: 30 }`

---

## Step 5: Component Architecture

```
src/
├── components/
│   ├── ui/          # Button, Card, Input, Badge, Modal, Tooltip
│   ├── layout/      # Header, Sidebar, Footer, PageWrapper
│   ├── sections/    # HeroSection, FeaturesGrid, PricingSection
│   └── charts/      # Recharts wrappers with custom styling
├── hooks/           # useScrollProgress, useMediaQuery, useDebounce
├── store/           # Zustand stores
├── lib/             # utils (cn()), API client, helpers
├── types/           # TypeScript interfaces
└── pages/           # Route-level components (lazy loaded)
```

Read `references/components.md` for full Button, Card, Input, and ThemeToggle implementations.

---

## Step 6: Visual Effects (Dribbble Signatures)

Always include at least 3 of these in every build:

1. **Gradient mesh background** — animated blobs with `mix-blend-multiply`
2. **Grid overlay** — subtle CSS grid pattern on dark sections
3. **Cursor glow** — `radial-gradient` that follows mouse position on cards
4. **Glassmorphism** — `backdrop-blur-xl` + `bg-white/10` + `border-white/20`
5. **Gradient text** — `bg-clip-text text-transparent` on headlines
6. **Colored shadows** — brand-colored box-shadow on primary elements
7. **Noise texture** — SVG noise overlay for depth
8. **Scroll-reveal** — `whileInView` stagger on all content sections

---

## Step 7: Dark Mode

ALWAYS implement dark mode. Use CSS variables — never `dark:` variants for colors.

```css
:root { --bg-primary: #FFFFFF; --text-primary: #0F172A; }
.dark { --bg-primary: #020617; --text-primary: #F8FAFC; }
```

Dark mode must look just as polished as light mode. Test both.

---

## Step 8: Quality Checklist

Before delivering ANY output, verify:

**Visual:**
- [ ] No hardcoded colors — all design tokens
- [ ] Typography scale consistent (no random sizes)
- [ ] All interactive elements: hover + focus + active + disabled states
- [ ] Dark mode equally polished
- [ ] No layout shifts during loading

**Animation:**
- [ ] Spring physics on all transitions (not ease-out)
- [ ] Page transitions smooth, no flicker
- [ ] Hover states respond < 150ms feel
- [ ] No animation > 600ms for UI elements
- [ ] `AnimatePresence` on all mount/unmount elements
- [ ] `prefers-reduced-motion` respected

**Code:**
- [ ] TypeScript strict — zero `any`
- [ ] All icons use `strokeWidth={1.5}`
- [ ] `cn()` for all conditional classes
- [ ] Error states as beautiful as success states
- [ ] Loading skeletons match final layout

---

## Reference Files

- `references/design-system.md` — Full Tailwind config, color tokens, spacing
- `references/animations.md` — All Framer Motion patterns with copy-paste code
- `references/components.md` — Button, Card, Input, ThemeToggle, Toast implementations
- `references/dependencies.md` — Full package.json with pinned versions
