import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I click the delete button for the first race in history', async function (this: CustomWorld) {
  const firstRecord = this.page!.locator('[data-testid="history-record"]').first();
  const deleteButton = firstRecord.locator('[data-testid="delete-history-button"]');
  await deleteButton.waitFor({ state: 'visible' });
  await deleteButton.click();
});
