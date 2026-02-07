import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

Given('the viewport is {string}', async function (this: CustomWorld, viewportSize: string) {
  if (!this.page) throw new Error('No page found');

  // Exit fullscreen if we are in it, to allow resizing
  await this.page.evaluate(() => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  });

  const [width, height] = viewportSize.split('x').map(Number);
  await this.page.setViewportSize({ width, height });
});
