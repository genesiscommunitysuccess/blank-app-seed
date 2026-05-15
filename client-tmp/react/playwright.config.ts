import { configDefaults } from '@genesislcap/foundation-testing/e2e';

export const PROTOCOL = process.env['PROTOCOL'] || 'http';
export const HOST = process.env['HOST'] || 'localhost';
// oxlint-disable-next-line no-magic-numbers -- 5173 is the standard Vite dev server port
export const PORT: number = Number(process.env['PORT']) || 5173;

export default {
  ...configDefaults,
  webServer: {
    ...configDefaults.webServer,
    url: `${PROTOCOL}://${HOST}:${PORT}`,
  },
  use: {
    ...configDefaults.use,
    baseURL: `${PROTOCOL}://${HOST}:${PORT}`,
  },
};
