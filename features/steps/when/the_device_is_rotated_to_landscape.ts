import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('the device is rotated to landscape', async function (this: CustomWorld) {
  if (!this.page) throw new Error('No page found');
  const viewport = this.page.viewportSize();
  if (viewport && viewport.height > viewport.width) {
    const newWidth = viewport.height;
    const newHeight = viewport.width;
    await this.page.setViewportSize({ width: newWidth, height: newHeight });

    // Give some time for the app to react to the new viewport size
    // Wait for the actual window size to match
    await this.page.waitForFunction((w) => window.innerWidth === w, newWidth, { timeout: 5000 });

    // Also wait for the main container to be visible and have non-zero width
    await this.page.waitForSelector('[data-testid="pwa-main"]', { state: 'visible', timeout: 5000 });
    await this.page.waitForFunction(() => {
      const el = document.querySelector('[data-testid="pwa-main"]');
      return el && el.getBoundingClientRect().width > 0;
    }, { timeout: 5000 });
  }
});
