import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules/', 'vendor/'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/setup.ts', 'vendor/'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'resources/js'),
      '@hadyfayed/filament-react-wrapper': resolve(__dirname, '../react-wrapper/resources/js'),
    },
  },
});