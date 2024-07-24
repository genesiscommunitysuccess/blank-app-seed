import { expect } from '@genesislcap/foundation-testing/e2e';
import { test } from '../../fixture';

test('expected page title', async ({ ProtectedPage, page }) => {
  await expect(page).toHaveTitle(/{{capitalCase appName}}/);
});
