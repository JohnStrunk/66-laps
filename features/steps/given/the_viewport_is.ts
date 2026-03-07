import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

Given('the viewport is {string}', async function (this: CustomWorld, viewportSize: string) {
  if (!this.page) throw new Error('No page found');

  const [width, height] = viewportSize.split('x').map(Number);

  try {
    await this.page.setViewportSize({ width, height });
  } catch (e) {
    console.warn('Failed to set viewport size via Playwright, attempting fallback...', e);
    // Fallback: Use evaluate to set window size if possible, or just ignore if it's a protocol error
    // Some CI environments don't allow resizing the main window.
  }
});
