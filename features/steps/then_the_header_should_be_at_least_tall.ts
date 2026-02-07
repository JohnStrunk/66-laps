import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Then('the header should be at least {string} tall', async function (this: CustomWorld, minHeightStr: string) {
  if (!this.page) throw new Error('No page found');
  const minHeight = parseInt(minHeightStr, 10);
  const header = this.page.locator('header');
  const box = await header.boundingBox();
  if (!box) throw new Error('Header not found');
  assert.ok(box.height >= minHeight, `Header height ${box.height} is less than ${minHeight}`);
});
