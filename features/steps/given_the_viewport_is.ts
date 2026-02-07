import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

Given('the viewport is {string}', async function (this: CustomWorld, viewportSize: string) {
  if (!this.page) throw new Error('No page found');

  const [width, height] = viewportSize.split('x').map(Number);
  await this.page.setViewportSize({ width, height });
});
