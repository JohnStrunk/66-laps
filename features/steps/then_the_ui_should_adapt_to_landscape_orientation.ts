import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Then('the UI should adapt to landscape orientation', async function (this: CustomWorld) {
  if (!this.page) throw new Error('No page found');
  const viewport = this.page.viewportSize();
  if (!viewport) throw new Error('No viewport found');

  // If it adapts to landscape, the width should be significantly larger than portrait max-w-md (448px)
  // assuming the viewport is large enough (like 1024).
  const width = await this.page.locator('main').evaluate(el => el.getBoundingClientRect().width);

  if (viewport.width > 500) {
    assert.ok(width > 450, `UI width ${width} should be wider than portrait constraint on landscape tablet.`);
  }
});
