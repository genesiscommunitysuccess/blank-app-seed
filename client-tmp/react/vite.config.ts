import { resolve } from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const jsonFilePath = resolve(process.cwd(), `env.${mode}.json`);
  const envConfig: { [key: string]: any } = {};
  
  if (fs.existsSync(jsonFilePath)) {
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');
    const parsedConfig = JSON.parse(jsonContent);
  
    for (const key in parsedConfig) {
      envConfig[`import.meta.env.${key}`] = JSON.stringify(parsedConfig[key]);
    }
  }

  return {
    define: envConfig,
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        'foundationZero/ZeroDesignSystem': resolve(__dirname, 'node_modules/@genesislcap/foundation-zero'),
      },
    },
  }
});