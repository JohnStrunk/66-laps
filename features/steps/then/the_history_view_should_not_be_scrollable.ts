import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the history view should not be scrollable', async function (this: CustomWorld) {
  const historyView = this.page!.locator('[data-testid="history-view"]');
  const scrollShadow = historyView.locator('.flex-1.p-4'); // This is the ScrollShadow container

  await expect(scrollShadow).toBeVisible();

  await expect.poll(async () => {
    return await scrollShadow.evaluate((el) => {
      return el.scrollHeight > el.clientHeight;
    });
  }, { timeout: 5000 }).toBe(false);
});
