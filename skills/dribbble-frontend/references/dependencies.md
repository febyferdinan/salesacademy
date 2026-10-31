# Full Dependency List

## package.json
```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.22.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0",
    "recharts": "^2.12.0",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.40.0",
    "@tanstack/react-virtual": "^3.5.0",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.4.0",
    "zod": "^3.23.0",
    "sonner": "^1.5.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0",
    "date-fns": "^3.6.0",
    "axios": "^1.7.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.4.0",
    "vite": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "@tailwindcss/typography": "^0.5.13",
    "@tailwindcss/forms": "^0.5.7"
  }
}
```

## Install Command
```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install framer-motion lucide-react recharts zustand @tanstack/react-query @tanstack/react-virtual react-hook-form @hookform/resolvers zod sonner clsx tailwind-merge date-fns axios
npm install -D tailwindcss postcss autoprefixer @tailwindcss/typography @tailwindcss/forms
npx tailwindcss init -p
```

## Vite Config (vite.config.ts)
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

## tsconfig.json paths
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] },
    "strict": true
  }
}
```
