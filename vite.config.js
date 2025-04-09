import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import {nodePolyfills} from 'vite-plugin-node-polyfills';
import tailwindcss from '@tailwindcss/vite'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      nodePolyfills(),
      tailwindcss(),
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.json']
    },
    server: {
      port: 3000,
      open: true,
    }
  };
});