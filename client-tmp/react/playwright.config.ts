import { configDefaults } from '@genesislcap/foundation-testing/e2e';

const PROTOCOL = process.env['PROTOCOL'] || 'http';
const HOST = process.env['HOST'] || 'localhost';
const PORT = process.env['PORT'] || 4200;

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