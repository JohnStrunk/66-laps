import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';
import { expect } from '@playwright/test';

Then('I should see a confirmation dialog for deleting the race', async function (this: CustomWorld) {
  const dialog = this.page!.locator('[role="dialog"]');
  await waitForVisible(dialog);
  await expect(dialog).toBeVisible();
  const title = dialog.locator('header');
  await expect(title).toBeVisible();
  const text = await title.innerText();
  if (!text.includes('Delete Race')) {
      throw new Error(`Expected dialog title to include "Delete Race", but got "${text}"`);
  }
});
