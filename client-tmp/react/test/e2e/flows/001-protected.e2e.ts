import { expect } from '@genesislcap/foundation-testing/e2e';
import { test } from '../fixture';

// `protectedPage` looks unused, but destructuring it is what makes Playwright instantiate
// the fixture — and the fixture's setup is what navigates `page` to the app.
test('expected page title', async ({ protectedPage, page }) => {
  await expect(page).toHaveTitle(/{{capitalCase appName}}/);
});
