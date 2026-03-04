import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('I should NOT be on the "History" screen', async function (this: CustomWorld) {
  // Wait a bit to ensure any navigation is settled
  await this.page!.waitForTimeout(200);
  const historyView = this.page!.locator('[data-testid="history-view"]');
  const isVisible = await historyView.isVisible();
  expect(isVisible, 'Should not be on History screen').toBe(false);
});
