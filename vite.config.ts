import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigpaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigpaths()],
  server: {
    headers: {
      // "Cross-Origin-Opener-Policy": "same-origin",
      // "Cross-Origin-Embedder-Policy": "require-corp"
    }
  }
});
