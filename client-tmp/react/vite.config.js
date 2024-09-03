import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'path';
import { defineConfig } from 'vite';
import fs from 'fs';
import react from '@vitejs/plugin-react';
import visualizer from 'rollup-plugin-visualizer';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const https =  process.env.HTTPS === 'true';
  const open = !(process.env.NO_OPEN === 'true');
  const jsonFilePath = resolve(process.cwd(), `env.${mode}.json`);
  const envConfig = {};
  
  if (fs.existsSync(jsonFilePath)) {
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');
    const parsedConfig = JSON.parse(jsonContent);
  
    for (const key in parsedConfig) {
      envConfig[`import.meta.env.${key}`] = JSON.stringify(parsedConfig[key]);
    }
  }

  const config = {
    define: envConfig,
    server: {
      https,
      open,
    },
    plugins: [
      react(),
    ],
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