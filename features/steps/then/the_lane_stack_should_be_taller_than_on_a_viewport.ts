import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('the lane stack should be taller than on a {string} viewport', async function (this: CustomWorld, otherViewport: string) {
  if (!this.page) throw new Error('No page found');

  const locator = this.page.locator('[data-testid="lane-stack"]');
  await locator.waitFor({ state: 'visible' });

  // Wait for height to be > 0
  await this.page.waitForFunction(() => {
    const el = document.querySelector('[data-testid="lane-stack"]');
    return (el?.getBoundingClientRect().height || 0) > 0;
  }, { timeout: 5000 }).catch(() => {});

  const currentHeight = await locator.boundingBox().then(b => b?.height || 0);

  const currentViewport = this.page.viewportSize();
  const [ow, oh] = otherViewport.split('x').map(Number);

  await this.page.setViewportSize({ width: ow, height: oh });
  // Wait a bit for layout to settle if there's any transition
  await this.page.waitForFunction(() => {
    const el = document.querySelector('[data-testid="lane-stack"]');
    return (el?.getBoundingClientRect().height || 0) > 0;
  }, { timeout: 5000 }).catch(() => {});

  const otherHeight = await this.page.locator('[data-testid="lane-stack"]').boundingBox().then(b => b?.height || 0);

  if (currentViewport) {
    await this.page.setViewportSize(currentViewport);
  }

  assert.ok(currentHeight > otherHeight, `Height on large viewport (${currentHeight}) should be greater than on ${otherViewport} (${otherHeight})`);
});
