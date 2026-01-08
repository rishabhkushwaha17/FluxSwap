import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable JSX in .js files
      include: '**/*.{jsx,js}',
    }),
  ],
  define: {
    // Fix for global in browser
    global: 'globalThis',
  },
  resolve: {
    alias: [
      // Polyfills for Node.js modules used by Web3 libraries
      { find: 'buffer', replacement: 'buffer' },
      { find: 'process', replacement: 'process/browser' },
    ],
  },
  optimizeDeps: {
    // Include Web3 libraries in pre-bundling
    include: [
      'ethers',
      'wagmi',
      'viem',
      '@reown/appkit',
      '@reown/appkit-adapter-wagmi',
      '@tanstack/react-query',
    ],
  },
  build: {
    // Increase chunk size warning limit for Web3 libraries
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3001,
    open: true,
  },
});
