import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('the UI should remain in portrait orientation', async function (this: CustomWorld) {
  if (!this.page) throw new Error('No page found');
  const width = await this.page.locator('[data-testid="pwa-main"]').evaluate(el => el.getBoundingClientRect().width);

  // We expect the width to be constrained to portrait (~448px)
  // even if the screen is wider (landscape).
  assert.ok(width <= 449, `UI width ${width} should be constrained to portrait (~448px) but is too wide.`);
});
