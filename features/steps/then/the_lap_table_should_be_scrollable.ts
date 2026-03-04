import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the lap table should be vertically scrollable', async function (this: CustomWorld) {
  // Find the scrollable container specifically for the table using our custom class
  const tableWrapper = this.page!.locator('.lap-oof-table-wrapper');
  await expect(tableWrapper).toBeVisible();

  const isScrollable = await tableWrapper.evaluate((el) => {
    return el.scrollHeight > el.clientHeight;
  });

  expect(isScrollable, 'The lap table is not vertically scrollable').toBe(true);
});
