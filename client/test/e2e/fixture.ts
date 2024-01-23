import { base } from '@genesislcap/foundation-testing/e2e';
import { ProtectedPage } from './pages';

const { config: pkgConfig } = require('../../package.json');

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

export const test = base.extend<Fixture>({
  config: [pkgConfig, { option: true }],
  protectedPage: async ({ config, page }, use) => {
    const protectedPage = new ProtectedPage(config, page);
    await protectedPage.goto();
    await use(protectedPage);
  },
});
