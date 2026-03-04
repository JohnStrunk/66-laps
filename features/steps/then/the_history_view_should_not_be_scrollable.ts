import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the history view should not be scrollable', async function (this: CustomWorld) {
  const historyView = this.page!.locator('[data-testid="history-view"]');
  const scrollShadow = historyView.locator('.flex-1.p-4'); // This is the ScrollShadow container

  await expect(scrollShadow).toBeVisible();

  const isScrollable = await scrollShadow.evaluate((el) => {
    return el.scrollHeight > el.clientHeight;
  });

  expect(isScrollable, `History view is scrollable: scrollHeight=${await scrollShadow.evaluate(el => el.scrollHeight)}, clientHeight=${await scrollShadow.evaluate(el => el.clientHeight)}`).toBe(false);
});
