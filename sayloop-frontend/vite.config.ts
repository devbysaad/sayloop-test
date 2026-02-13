import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'next/navigation': path.resolve(__dirname, './src/mocks/next-navigation.ts'),
      'next/link': path.resolve(__dirname, './src/mocks/next-link.tsx'),
      'next/compat/router': path.resolve(__dirname, './src/mocks/next-compat-router.ts')
    },
  },
});