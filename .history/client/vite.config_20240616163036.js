import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // Assure-toi d'importer le module 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@stores': path.resolve(__dirname, 'src/stores'), 
    }
  },
  server: {
    host: true,
    watch: {
      usePolling: true,
    }
  }
});
