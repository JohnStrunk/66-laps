import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('the UI should adapt to landscape orientation', async function (this: CustomWorld) {
  if (!this.page) throw new Error('No page found');

  const mainLocator = this.page.locator('[data-testid="pwa-main"]');

  // Wait for the width to exceed the portrait constraint (448px)
  // This ensures the adaptation has actually happened.
  await this.page.waitForFunction(() => {
    const el = document.querySelector('[data-testid="pwa-main"]');
    if (!el) return false;
    const width = el.getBoundingClientRect().width;
    return width > 450;
  }, { timeout: 5000 });

  const viewport = this.page.viewportSize();
  if (!viewport) throw new Error('No viewport found');

  const width = await mainLocator.evaluate(el => el.getBoundingClientRect().width);

  // In landscape, we expect the UI to take up most or all of the viewport width
  // (allowing for some padding/margins if applicable, but definitely not constrained to 448px)
  assert.ok(width > 450, `UI width ${width} should be wider than portrait constraint in landscape mode.`);
  assert.ok(Math.abs(width - viewport.width) < 50, `UI width ${width} should be close to viewport width ${viewport.width}`);
});
