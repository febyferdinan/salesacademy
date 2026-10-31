# Framer Motion Animation Patterns

## 1. Page Transition Wrapper
```tsx
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.25 } },
};

export const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.div>
);

// In App.tsx with AnimatePresence:
<AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>
    {/* routes */}
  </Routes>
</AnimatePresence>
```

---

## 2. Stagger Container (Lists, Grids, Cards)
```tsx
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 28 }
  },
};

// Usage:
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="show"
  className="grid grid-cols-3 gap-6"
>
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      <Card>{item.content}</Card>
    </motion.div>
  ))}
</motion.div>
```

---

## 3. Scroll-triggered Reveal
```tsx
// Use on ALL content sections below the fold
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-80px' }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
>
  <SectionContent />
</motion.div>
```

---

## 4. Cursor Glow Card Effect
```tsx
const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
};

<div
  onMouseMove={handleMouseMove}
  className="relative group overflow-hidden rounded-2xl border border-neutral-100"
>
  <div
    className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    style={{
      background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139,92,246,0.12), transparent 70%)`,
    }}
  />
  {cardContent}
</div>
```

---

## 5. Animated Counter
```tsx
import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion';
import { useEffect } from 'react';

const AnimatedCounter = ({ value, suffix = '', prefix = '' }: {
  value: number; suffix?: string; prefix?: string;
}) => {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 80, damping: 20 });
  const rounded = useTransform(springValue, (v) => Math.round(v).toLocaleString());

  useEffect(() => { motionValue.set(value); }, [value, motionValue]);

  return <motion.span>{prefix}{rounded}{suffix}</motion.span>;
};
```

---

## 6. Morphing Blobs (Hero Background)
```tsx
const AnimatedBlobs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {[
      { color: '#8B5CF6', size: 500, delay: 0 },
      { color: '#EC4899', size: 400, delay: 1.5 },
      { color: '#06B6D4', size: 450, delay: 3 },
    ].map(({ color, size, delay }, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        style={{ background: color, width: size, height: size }}
        animate={{
          x: [0, 60 * (i % 2 === 0 ? 1 : -1), 0],
          y: [0, 40 * (i % 3 === 0 ? -1 : 1), 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut', delay }}
      />
    ))}
  </div>
);
```

---

## 7. Hover Card Lift
```tsx
// For cards that should "float" on hover
<motion.div
  className="rounded-2xl bg-white shadow-sm border border-neutral-100 p-6"
  whileHover={{ y: -6, boxShadow: '0 20px 40px rgb(0 0 0 / 0.12)' }}
  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
>
  {content}
</motion.div>
```

---

## 8. Icon Animated Button
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.97 }}
  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 text-white font-medium"
>
  Get Started
  <motion.span whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400 }}>
    <ArrowRight size={18} strokeWidth={1.5} />
  </motion.span>
</motion.button>
```

---

## 9. Sidebar Animated Entry
```tsx
<motion.aside
  initial={{ x: -280, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ type: 'spring', stiffness: 300, damping: 35, delay: 0.1 }}
  className="w-[260px] flex-shrink-0 border-r border-neutral-100 bg-white"
>
  {sidebarContent}
</motion.aside>
```

---

## 10. Animated Badge / Pill (Hero)
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
>
  <motion.span
    className="w-2 h-2 rounded-full bg-brand-400"
    animate={{ opacity: [1, 0.4, 1] }}
    transition={{ duration: 2, repeat: Infinity }}
  />
  <span className="text-sm text-white/70 font-medium">New feature just launched</span>
</motion.div>
```

---

## Spring Configs (Reference)

```ts
// Snappy (UI elements, buttons)
{ type: 'spring', stiffness: 400, damping: 30 }

// Bouncy (badges, tooltips, modals)
{ type: 'spring', stiffness: 300, damping: 20 }

// Smooth (page transitions, sidebars)
{ type: 'spring', stiffness: 200, damping: 30 }

// Gentle (counters, progress bars)
{ stiffness: 80, damping: 20 }
```

## Accessibility
```tsx
// Always respect prefers-reduced-motion
import { useReducedMotion } from 'framer-motion';

const shouldReduceMotion = useReducedMotion();
const transition = shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 };
```
