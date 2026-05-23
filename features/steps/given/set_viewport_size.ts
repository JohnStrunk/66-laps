import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

Given('I set viewport size to {int}x{int}', async function (this: CustomWorld, width: number, height: number) {
  if (!this.page) {
    throw new Error('Page not initialized');
  }
  await this.page.setViewportSize({ width, height });
});
