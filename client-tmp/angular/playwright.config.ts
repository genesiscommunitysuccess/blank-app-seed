import { configDefaults } from '@genesislcap/foundation-testing/e2e';
import { environment } from './src/environments/environment';
import * as dotenv from 'dotenv';

dotenv.config();

const PROTOCOL = process.env['PROTOCOL'] || environment.PROTOCOL || 'http';
const HOST = process.env['HOST'] || environment.HOST || 'localhost';
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
    }
};