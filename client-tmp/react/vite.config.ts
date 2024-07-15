import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      'foundationZero/ZeroDesignSystem': resolve(__dirname, 'node_modules/@genesislcap/foundation-zero'),
    },
  },
});
