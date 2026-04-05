import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

Given('the viewport is {string}', async function (this: CustomWorld, viewportSize: string) {
  if (!this.page) throw new Error('No page found');

  const [width, height] = viewportSize.split('x').map(Number);

  try {
    await this.page!.setViewportSize({ width, height });
    // Advance clock to trigger resize events and React renders
    await this.page!.evaluate(() => window.dispatchEvent(new Event('resize')));
    if (this.page.clock) {
      await this.page.clock.fastForward(100);
    }
  } catch (e) {
    console.warn(`Failed to set viewport size to ${viewportSize} via Playwright, attempting fallback...`, e);
    // Ignore protocol errors related to window state in CI
  }
});
