import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the lap table should not have horizontal scrolling', async function (this: CustomWorld) {
  const tableWrapper = this.page!.locator('.lap-oof-table-wrapper');
  await expect(tableWrapper).toBeVisible();

  const result = await tableWrapper.evaluate((el) => {
    return {
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      hasHorizontalScroll: el.scrollWidth > el.clientWidth + 1 // 1px tolerance
    };
  });

  expect(result.hasHorizontalScroll, `The lap table has horizontal scrolling (scrollWidth: ${result.scrollWidth}, clientWidth: ${result.clientWidth})`).toBe(false);
});
