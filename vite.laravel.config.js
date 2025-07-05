import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Laravel-ready build configuration
export default defineConfig({
    plugins: [
        react({
            include: "**/*.{jsx,tsx}",
        })
    ],
    build: {
        rollupOptions: {
            input: resolve(__dirname, 'resources/js/index.tsx'),
            output: {
                // Create Laravel-friendly filenames
                entryFileNames: 'js/workflow-canvas.js',
                chunkFileNames: 'js/chunks/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash][extname]',
                format: 'umd',
                name: 'WorkflowCanvas',
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'reactflow': 'ReactFlow',
                    '@heroicons/react': 'HeroIcons',
                    'uuid': 'uuid'
                }
            },
            external: ['react', 'react-dom', 'reactflow', '@heroicons/react', 'uuid']
        },
        outDir: 'dist/laravel',
        sourcemap: true,
        minify: 'terser',
        target: 'es2020'
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify('production')
    }
});