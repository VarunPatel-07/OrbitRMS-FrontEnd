import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [
    react(),
    eslint({
      fix: true,
      failOnWarning: false,
      failOnError: true,
    }),
  ],
  assetsInclude: ['**/*.lottie'],
  build: {
    minify: true,
    chunkSizeWarningLimit: 1000, 
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],

          lodash: ['lodash'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
