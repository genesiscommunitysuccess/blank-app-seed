import { test as base } from '@playwright/test';
import { ProtectedPage } from './pages';

const { config: pkgConfig } = require('../../package.json');

// move to testing...
export type FixtureConfig = {
  API_HOST: string;
  DEFAULT_USER: string;
  DEFAULT_PASSWORD: string;
  PORT: number;
};

export type Fixture = {
  config: FixtureConfig; // < worker level?
  protectedPage: ProtectedPage;
};

export const test = base.extend<Fixture>({
  config: [pkgConfig, { option: true }],
  protectedPage: async ({ config, page }, use) => {
    const protectedPage = new ProtectedPage(config, page);
    await protectedPage.goto();
    await use(protectedPage);
    // we can clean up fixtures after use when needed
  },
  /**
   * TODO Add remaining pages
   */
});
