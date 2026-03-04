import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the header should be at least {string} tall', async function (this: CustomWorld, minHeightStr: string) {
  if (!this.page) throw new Error('No page found');
  const minHeight = parseInt(minHeightStr, 10);
  const header = this.page.locator('[data-testid="bell-lap-header"]');
  await expect(header).toBeVisible();

  let box = await header.boundingBox();
  if (!box) {
    // Retry once if bounding box is null (possible during re-render)
    await new Promise(r => setTimeout(r, 200));
    box = await header.boundingBox();
  }

  if (!box) throw new Error('Header not found');
  expect(box.height >= minHeight, `Header height ${box.height} is less than ${minHeight}`).toBeTruthy();
});
