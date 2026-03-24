import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Path aliases — keep in sync with tsconfig.app.json "paths"
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/page'),
      '@redux': path.resolve(__dirname, './src/redux'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@constants': path.resolve(__dirname, './src/constants'),
      // Next.js shims (required by some dependencies)
      'next/navigation': path.resolve(__dirname, './src/mocks/next-navigation.ts'),
      'next/link': path.resolve(__dirname, './src/mocks/next-link.tsx'),
      'next/compat/router': path.resolve(__dirname, './src/mocks/next-compat-router.ts'),
    },
  },
});