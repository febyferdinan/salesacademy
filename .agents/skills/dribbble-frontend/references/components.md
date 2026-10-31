# Core Component Implementations

## Utility: cn() helper
```ts
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```

---

## Button Component
```tsx
// components/ui/Button.tsx
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:   'bg-brand-500 hover:bg-brand-600 text-white shadow-brand hover:shadow-brand-lg',
  secondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-100',
  ghost:     'bg-transparent hover:bg-neutral-100 text-neutral-700 dark:hover:bg-neutral-800 dark:text-neutral-300',
  danger:    'bg-error hover:bg-red-600 text-white',
  outline:   'border border-neutral-200 hover:border-brand-300 bg-white text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200',
};

const sizes: Record<ButtonSize, string> = {
  sm:  'h-8  px-3   text-xs   gap-1.5 rounded-lg',
  md:  'h-10 px-4   text-sm   gap-2   rounded-xl',
  lg:  'h-12 px-6   text-base gap-2.5 rounded-xl',
  xl:  'h-14 px-8   text-lg   gap-3   rounded-2xl',
};

export const Button = ({
  variant = 'primary', size = 'md', loading, icon,
  iconPosition = 'left', fullWidth, className, children, disabled, ...props
}: ButtonProps) => (
  <motion.button
    className={cn(
      'inline-flex items-center justify-center font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variants[variant], sizes[size],
      fullWidth && 'w-full',
      className
    )}
    whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
    whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    disabled={disabled || loading}
    {...(props as any)}
  >
    {loading ? (
      <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
        <Loader2 size={16} strokeWidth={1.5} />
      </motion.span>
    ) : (iconPosition === 'left' && icon)}
    {children}
    {!loading && iconPosition === 'right' && icon}
  </motion.button>
);
```

---

## Card Component
```tsx
// components/ui/Card.tsx
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  bordered?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8', xl: 'p-10' };

export const Card = ({ children, className, hover, glass, bordered, padding = 'md' }: CardProps) => (
  <motion.div
    className={cn(
      'rounded-2xl overflow-hidden',
      glass ? 'glass' : 'bg-white dark:bg-neutral-900',
      bordered && 'border border-neutral-100 dark:border-neutral-800',
      !glass && 'shadow-sm',
      paddings[padding],
      className
    )}
    whileHover={hover ? { y: -4 } : undefined}
    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
  >
    {children}
  </motion.div>
);
```

---

## Input Field with Validation
```tsx
// components/ui/InputField.tsx
import { useFormContext } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

export const InputField = ({ name, label, type = 'text', placeholder, icon, required }: InputFieldProps) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label} {required && <span className="text-error">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          {...register(name)}
          type={type}
          placeholder={placeholder}
          className={cn(
            'w-full h-11 bg-white dark:bg-neutral-800 rounded-xl text-sm transition-all duration-200',
            'border focus:outline-none focus:ring-2 focus:ring-offset-0',
            'text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400',
            icon ? 'pl-10 pr-4' : 'px-4',
            error
              ? 'border-error focus:border-error focus:ring-error/20'
              : 'border-neutral-200 dark:border-neutral-700 focus:border-brand-400 focus:ring-brand-500/20'
          )}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-xs text-error"
          >
            <AlertCircle size={12} strokeWidth={1.5} />
            {error.message as string}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
```

---

## Theme Toggle
```tsx
// components/ui/ThemeToggle.tsx
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ThemeToggle = ({ isDark, toggle }: { isDark: boolean; toggle: () => void }) => (
  <button
    onClick={toggle}
    className="relative w-10 h-10 rounded-xl flex items-center justify-center
      bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
    aria-label="Toggle dark mode"
  >
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={isDark ? 'dark' : 'light'}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isDark
          ? <Sun size={18} strokeWidth={1.5} className="text-amber-400" />
          : <Moon size={18} strokeWidth={1.5} className="text-neutral-600" />
        }
      </motion.div>
    </AnimatePresence>
  </button>
);
```

---

## Recharts Chart Wrapper
```tsx
// components/charts/AreaChartCard.tsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl shadow-xl p-4 min-w-[140px]">
      <p className="text-xs font-medium text-neutral-400 mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {entry.value.toLocaleString()}
          </span>
          <span className="text-xs text-neutral-400">{entry.name}</span>
        </div>
      ))}
    </div>
  );
};

export const AreaChartCard = ({ data, dataKey, color = '#8B5CF6' }: {
  data: any[]; dataKey: string; color?: string;
}) => (
  <ResponsiveContainer width="100%" height={240}>
    <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
      <defs>
        <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.3} />
          <stop offset="95%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.04)" vertical={false} />
      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
      <Tooltip content={<CustomTooltip />} />
      <Area
        type="monotone" dataKey={dataKey}
        stroke={color} strokeWidth={2}
        fill={`url(#gradient-${dataKey})`}
        dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: color }}
        isAnimationActive={true} animationDuration={800}
      />
    </AreaChart>
  </ResponsiveContainer>
);
```

---

## Hero Section Template
```tsx
// sections/HeroSection.tsx — dark futuristic variant
export const HeroSection = () => {
  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } },
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-neutral-950">
      {/* Animated blobs */}
      <AnimatedBlobs />
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:64px_64px]" />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,6,23,0.8)_100%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-4xl">
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <motion.span className="w-2 h-2 rounded-full bg-brand-400" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            <span className="text-sm text-white/70 font-medium">v2.0 just launched — see what's new</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itemVariants} className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
            Build something<br />
            <span className="gradient-text">extraordinary</span>
          </motion.h1>

          {/* Lead */}
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-10 leading-relaxed">
            Description of your product. Make it compelling and specific. No lorem ipsum.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <Button size="xl" icon={<ArrowRight size={20} strokeWidth={1.5} />} iconPosition="right">
              Get started free
            </Button>
            <Button size="xl" variant="outline" className="border-white/10 text-white hover:bg-white/5">
              View demo
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
```

---

## Dashboard Layout
```tsx
// layout/DashboardLayout.tsx
export const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
    <motion.aside
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 35 }}
      className="w-[260px] flex-shrink-0 border-r border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col"
    >
      <SidebarContent />
    </motion.aside>
    <main className="flex-1 overflow-auto">
      <div className="max-w-[1400px] mx-auto p-8">
        {children}
      </div>
    </main>
  </div>
);
```
