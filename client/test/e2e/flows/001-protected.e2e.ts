import { expect } from '@playwright/test';
import { test } from '../fixture';


// test.describe.configure({ mode: 'parallel' });

/**
 * TODO: This would need to follow the login e2e tests, ie. be logged in to get to protected
 */
test('expected page title', async ({ protectedPage, page }) => {
  await expect(page).toHaveTitle(/Client App - Auth - Login/);
});
