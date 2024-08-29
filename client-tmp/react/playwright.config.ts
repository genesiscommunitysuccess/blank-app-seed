import { configDefaults } from '@genesislcap/foundation-testing/e2e';

export const PROTOCOL = process.env['PROTOCOL'] || 'http';
export const HOST = process.env['HOST'] || 'localhost';
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
    }
};