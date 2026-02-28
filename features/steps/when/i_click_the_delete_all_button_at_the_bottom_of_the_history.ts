import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I click the "Delete all" button at the bottom of the history', async function (this: CustomWorld) {
  const deleteAllButton = this.page!.locator('[data-testid="delete-all-history-button"]');
  await deleteAllButton.waitFor({ state: 'visible' });
  await deleteAllButton.click();
});
