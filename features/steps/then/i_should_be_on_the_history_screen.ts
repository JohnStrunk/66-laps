import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('I should be on the "History" screen', async function (this: CustomWorld) {
  const historyView = await this.page!.locator('[data-testid="history-view"]');
  await expect(historyView).toBeVisible();
});
