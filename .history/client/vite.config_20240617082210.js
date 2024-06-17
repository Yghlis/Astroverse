import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import commonjs from '@rollup/plugin-commonjs'; // Importez le plugin CommonJS

export default defineConfig({
  plugins: [
    vue(),
    commonjs()  // Ajoutez le plugin CommonJS ici
  ],
  resolve: {
    alias: {
      '@stores': path.resolve(__dirname, 'src/stores'),  // Alias existant pour vos stores
    }
  },
  server: {
    host: true,
    watch: {
      usePolling: true,  // Pour les systèmes de fichiers qui ne supportent pas nativement les événements de changement
    }
  }
});
