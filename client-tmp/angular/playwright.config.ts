import { configDefaults } from '@genesislcap/foundation-testing/e2e';
import * as dotenv from 'dotenv';
import { environment } from './src/environments/environment';

dotenv.config();

const PROTOCOL = process.env['PROTOCOL'] || environment.PROTOCOL || 'http';
const HOST = process.env['HOST'] || environment.HOST || 'localhost';
// oxlint-disable-next-line no-magic-numbers -- 4200 is the standard Angular dev server port
const PORT = process.env['PORT'] || environment.PORT || 4200;

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
