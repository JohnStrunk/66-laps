import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Then('the entire UI should fit on-screen without scrolling', async function (this: CustomWorld) {
  if (!this.page) throw new Error('No page found');

  const isScrollable = await this.page.evaluate(() => {
    return document.documentElement.scrollHeight > window.innerHeight;
  });

  assert.strictEqual(isScrollable, false, `Page is scrollable: ${await this.page.evaluate(() => document.documentElement.scrollHeight)} > ${await this.page.evaluate(() => window.innerHeight)}`);
});
