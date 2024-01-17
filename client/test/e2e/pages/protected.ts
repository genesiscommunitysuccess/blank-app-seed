import type { Page } from '@playwright/test';
import type { FixtureConfig } from '../fixture';

export class ProtectedPage {
  config: FixtureConfig;
  page: Page;

  constructor(config: FixtureConfig, page: Page) {
    this.config = config;
    this.page = page;
    /**
     * Locate fields not guarded by conditionals upfront, and the remaining on-demand
     */
  }

  async goto() {
    await this.page.goto('/');
  }
}
