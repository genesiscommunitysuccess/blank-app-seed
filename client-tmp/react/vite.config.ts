import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const API_HOST = mode === 'development' ? '{{apiHost}}' : '';

  return {
    plugins: [
      react(),
    ],
    define: {
      'process.env.ENABLE_SSO': false,
      'process.env.API_HOST': API_HOST,
    },
    resolve: {
      alias: {
        'foundationZero/ZeroDesignSystem': resolve(__dirname, 'node_modules/@genesislcap/foundation-zero'),
      },
    },
  }
});