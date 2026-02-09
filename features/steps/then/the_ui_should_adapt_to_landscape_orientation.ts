import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('the UI should adapt to landscape orientation', async function (this: CustomWorld) {
  if (!this.page) throw new Error('No page found');
  const viewport = this.page.viewportSize();
  if (!viewport) throw new Error('No viewport found');

  const width = await this.page.locator('[data-testid="pwa-main"]').evaluate(el => el.getBoundingClientRect().width);

  // In landscape, we expect the UI to take up most or all of the viewport width
  // (allowing for some padding/margins if applicable, but definitely not constrained to 448px)
  assert.ok(width > 450, `UI width ${width} should be wider than portrait constraint in landscape mode.`);
  assert.ok(Math.abs(width - viewport.width) < 50, `UI width ${width} should be close to viewport width ${viewport.width}`);
});
