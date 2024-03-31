import react from '@vitejs/plugin-react-swc';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import tsconfigpaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigpaths(), splitVendorChunkPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.match('framer-motion')) {
            return 'framer-motion';
          }
          if (id.match('zod')) {
            return 'zod';
          }
          if (id.match('react-select')) {
            return 'react-select';
          }
          if (id.match('react-dropzone')) {
            return 'react-dropzone';
          }
        },
      },
    },
  },
  server: {
    headers: {
      // "Cross-Origin-Opener-Policy": "same-origin",
      // "Cross-Origin-Embedder-Policy": "require-corp"
    },
  },
});
