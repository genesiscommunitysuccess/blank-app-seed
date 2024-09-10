import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'path';
import { defineConfig, UserConfig } from 'vite';
import fs from 'fs';
import react from '@vitejs/plugin-react';
import visualizer from 'rollup-plugin-visualizer';
import tsconfigPaths from 'vite-plugin-tsconfig-paths';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }: { mode: string }): UserConfig => {
  const https: boolean = process.env.HTTPS === 'true';
  const open: boolean = !(process.env.NO_OPEN === 'true');
  const jsonFilePath: string = resolve(process.cwd(), `env.${mode}.json`);
  const envConfig: Record<string, string> = {};
  
  if (fs.existsSync(jsonFilePath)) {
    const jsonContent: string = fs.readFileSync(jsonFilePath, 'utf-8');
    const parsedConfig: Record<string, any> = JSON.parse(jsonContent);
  
    for (const key in parsedConfig) {
      envConfig[`import.meta.env.${key}`] = JSON.stringify(parsedConfig[key]);
    }
  }

  const config: UserConfig = {
    define: envConfig,
    server: {
      https,
      open,
    },
    plugins: [
      react(),
      tsconfigPaths(),
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