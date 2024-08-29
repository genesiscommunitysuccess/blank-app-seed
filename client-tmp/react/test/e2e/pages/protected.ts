import type { Page } from '@genesislcap/foundation-testing/e2e';
import type { FixtureConfig } from '../fixture';

export class ProtectedPage {
  config: FixtureConfig;
  page: Page;

  constructor(config: FixtureConfig, page: Page) {
    this.config = config;
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
  }
}
