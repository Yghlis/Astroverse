import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig({
  plugins: [
    vue(),
    commonjs()
  ],
  resolve: {
    alias: {
      '@stores': path.resolve(__dirname, 'src/stores'),  // Alias existant pour vos stores
      '@composables': path.resolve(__dirname, 'src/composables')  // Nouvel alias pour vos composables
    }
  },
  server: {
    host: true,
    watch: {
      usePolling: true,  // Pour les systèmes de fichiers qui ne supportent pas nativement les événements de changement
    }
  }
});
