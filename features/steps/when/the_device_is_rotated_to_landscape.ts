import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('the device is rotated to landscape', async function (this: CustomWorld) {
  if (!this.page) throw new Error('No page found');
  const viewport = this.page.viewportSize();
  if (viewport && viewport.height > viewport.width) {
    await this.page.setViewportSize({ width: viewport.height, height: viewport.width });
  }
});
