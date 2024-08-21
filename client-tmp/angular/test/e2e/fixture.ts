import { base, Page } from '@genesislcap/foundation-testing/e2e';
import { ProtectedPage } from './pages';
import { environment } from '../../src/environments/environment.ts'

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

const { PORT, API_HOST } = environment;
export const test = base.extend<Fixture>({
  config: [{ PORT, API_HOST, DEFAULT_PASSWORD: '', DEFAULT_USER: '' }, { option: true }],
  protectedPage: async ({ config, page }: { config: FixtureConfig, page: Page }, use: any) => {
    const protectedPage = new ProtectedPage(config, page);
    await protectedPage.goto();
    await use(protectedPage);
  },
});
