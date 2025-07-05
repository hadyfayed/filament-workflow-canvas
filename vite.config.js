import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// Standalone Vite config for Workflow Canvas package
export default defineConfig({
    plugins: [
        react({
            include: "**/*.{jsx,tsx}",
            babel: {
                plugins: ['@babel/plugin-transform-runtime'],
                presets: [['@babel/preset-env', { targets: 'defaults' }], '@babel/preset-typescript']
            }
        }),
        dts({
            insertTypesEntry: true,
            outputDir: 'dist/types',
            tsConfigFilePath: 'tsconfig.json'
        })
    ],
    build: {
        lib: {
            entry: {
                'index': resolve(__dirname, 'resources/js/index.tsx'),
            },
            formats: ['es'],
            fileName: (format, entryName) => `${entryName}.${format}.js`,
        },
        rollupOptions: {
            external: [
                'react', 
                'react-dom', 
                'reactflow',
                '@heroicons/react/24/outline',
                '@heroicons/react/24/solid',
                'uuid',
                '@hadyfayed/filament-react-wrapper'
            ],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    reactflow: 'ReactFlow',
                    uuid: 'UUID'
                },
                manualChunks: {
                    'workflow-core': ['./resources/js/utils.ts', './resources/js/types.ts'],
                    'workflow-services': ['./resources/js/services/WorkflowManagerService.ts', './resources/js/services/NodeManagerService.ts'],
                    'workflow-components': ['./resources/js/components/canvas/WorkflowCanvas.tsx', './resources/js/components/canvas/WorkflowCore.tsx'],
                    'workflow-interfaces': ['./resources/js/interfaces/IWorkflowManager.ts'],
                    'workflow-factories': ['./resources/js/factories/WorkflowServiceFactory.ts']
                },
                chunkFileNames: 'chunks/[name]-[hash].js',
                minifyInternalExports: true
            }
        },
        outDir: 'dist',
        sourcemap: true,
        target: 'esnext',
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: !process.env.VITE_DEBUG,
                drop_debugger: !process.env.VITE_DEBUG
            }
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'resources/js'),
            '@hadyfayed/filament-react-wrapper': resolve(__dirname, '../react-wrapper/resources/js'),
        },
    },
});