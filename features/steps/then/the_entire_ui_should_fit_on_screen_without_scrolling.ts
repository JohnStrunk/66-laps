import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the entire UI should fit on-screen without scrolling', async function (this: CustomWorld) {
  if (!this.page) throw new Error('No page found');

  await expect.poll(async () => {
    return await this.page!.evaluate(() => {
      return document.documentElement.scrollHeight > window.innerHeight;
    });
  }, { timeout: 5000 }).toBe(false);
});
