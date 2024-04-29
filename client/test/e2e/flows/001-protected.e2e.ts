import { expect } from '@genesislcap/foundation-testing/e2e';
import { test } from '../fixture';

test('expected page title', async ({ protectedPage, page }) => {
  await expect(page).toHaveTitle(/Testapp - Login - Login/);
});
