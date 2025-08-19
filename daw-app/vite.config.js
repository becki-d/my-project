// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    assetsInclude: ['**/*.worklet.js']  // Required for Worklets
  }
});