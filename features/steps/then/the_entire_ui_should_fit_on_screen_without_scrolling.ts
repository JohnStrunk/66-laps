import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the entire UI should fit on-screen without scrolling', async function (this: CustomWorld) {
  if (!this.page) throw new Error('No page found');

  const isScrollable = await this.page.evaluate(() => {
    return document.documentElement.scrollHeight > window.innerHeight;
  });

  expect(isScrollable, `Page is scrollable: ${await this.page.evaluate(() => document.documentElement.scrollHeight)} > ${await this.page.evaluate(() => window.innerHeight)}`).toBe(false);
});
