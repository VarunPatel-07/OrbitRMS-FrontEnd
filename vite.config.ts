import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import eslint from 'vite-plugin-eslint';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}'],
      },
    }),
    eslint({
      fix: true,
      failOnWarning: false,
      failOnError: true,
    }),
    visualizer({
      open: true,
      filename: 'stats.html',
      gzipSize: true,
      brotliSize: true,
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
          tiptap: [
            '@tiptap/extension-bold',
            '@tiptap/extension-document',
            '@tiptap/extension-highlight',
            '@tiptap/extension-italic',
            '@tiptap/extension-link',
            '@tiptap/extension-mention',
            '@tiptap/extension-paragraph',
            '@tiptap/extension-strike',
            '@tiptap/extension-text',
            '@tiptap/extension-text-align',
            '@tiptap/react',
            '@tiptap/starter-kit',
            '@tiptap/suggestion',
          ],
          reactDatePicker: ['react-datepicker'],
          EmojiPickerReact: ['emoji-picker-react'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
