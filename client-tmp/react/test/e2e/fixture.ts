import { base, Page } from '@genesislcap/foundation-testing/e2e';
import { ProtectedPage } from './pages';
import { PORT } from '../../playwright.config';

export type FixtureConfig = {
  API_HOST: string;
  DEFAULT_USER: string;
  DEFAULT_PASSWORD: string;
  PORT: number;
};

export type Fixture = {
  config: FixtureConfig;
  protectedPage: ProtectedPage;
};

const API_HOST = process.env['API_HOST'] || 'localhost';

export const test = base.extend<Fixture>({
  config: [{ PORT, API_HOST, DEFAULT_PASSWORD: '', DEFAULT_USER: '' }, { option: true }],
  protectedPage: async ({ config, page }: { config: FixtureConfig, page: Page }, use: (page: ProtectedPage) => Promise<unknown>) => {
    const protectedPage = new ProtectedPage(config, page);
    await protectedPage.goto();
    await use(protectedPage);
  },
});
