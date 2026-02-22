import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('I should NOT be on the "History" screen', async function (this: CustomWorld) {
  // Wait a bit to ensure any navigation is settled
  await this.page!.waitForTimeout(200);
  const historyView = this.page!.locator('[data-testid="history-view"]');
  const isVisible = await historyView.isVisible();
  assert.strictEqual(isVisible, false, 'Should not be on History screen');
});
