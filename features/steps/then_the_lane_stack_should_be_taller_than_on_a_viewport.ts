import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Then('the lane stack should be taller than on a {string} viewport', async function (this: CustomWorld, otherViewport: string) {
  if (!this.page) throw new Error('No page found');

  const currentHeight = await this.page.locator('[data-testid="lane-stack"]').boundingBox().then(b => b?.height || 0);

  const currentViewport = this.page.viewportSize();
  const [ow, oh] = otherViewport.split('x').map(Number);

  await this.page.setViewportSize({ width: ow, height: oh });
  // Wait a bit for layout to settle if there's any transition
  await this.page.waitForTimeout(100);
  const otherHeight = await this.page.locator('[data-testid="lane-stack"]').boundingBox().then(b => b?.height || 0);

  if (currentViewport) {
    await this.page.setViewportSize(currentViewport);
  }

  assert.ok(currentHeight > otherHeight, `Height on large viewport (${currentHeight}) should be greater than on ${otherViewport} (${otherHeight})`);
});
