import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'path';
import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import visualizer from 'rollup-plugin-visualizer';
import tsconfigPaths from 'vite-plugin-tsconfig-paths';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }: { mode: string }): UserConfig => {
  const https: boolean = process.env.HTTPS === 'true';
  const open: boolean = !(process.env.NO_OPEN === 'true');
  const environmentFile = mode === 'production'
    ? 'environment.prod.ts' 
    : 'environment.ts';
  const environmentPath = resolve(__dirname, 'src/environments', environmentFile);

  const config: UserConfig = {
    define: {
      BUILDER: JSON.stringify('vite'),
    },
    server: {
      https,
      open,
      fs: {
        strict: false,
      }
    },
    plugins: [
      react(),
      tsconfigPaths(),
    ],
    build: {
      rollupOptions: {
        plugins: [],
        treeshake: false,
      },
    },
    resolve: {
      alias: {
        'foundationZero/ZeroDesignSystem': resolve(__dirname, 'node_modules/@genesislcap/foundation-zero'),
        '@': resolve(__dirname, 'src'),
        '@environment': environmentPath,
        'pbc': resolve(__dirname, 'src/pbc'),
      },
      preserveSymlinks: true,
    },
    esbuild: {
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
        },
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