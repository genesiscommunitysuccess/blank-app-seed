import { fileURLToPath } from 'node:url';
import { resolve } from 'path';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import visualizer from 'rollup-plugin-visualizer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode, noOpen = false }) => {
  const config = {
    plugins: [
      react(),
    ],
    server: {
      open: !noOpen,
    },
    build: {
      rollupOptions: {
        plugins: []
      }
    },
    resolve: {
      alias: {
        'foundationZero/ZeroDesignSystem': resolve(__dirname, 'node_modules/@genesislcap/foundation-zero'),
      },
    },
  };

  if (mode === 'stats') {
    config.build.rollupOptions.plugins.push(
      visualizer({
        template: 'raw-data',
        filename: 'stats.json',
        open: true,
        gzipSize: true,
        brotliSize: true,
      })
    );
  }

  return config;
});