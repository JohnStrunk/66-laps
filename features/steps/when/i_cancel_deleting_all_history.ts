import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForHidden, waitForVisible } from '../../support/utils';

When('I cancel deleting all history', async function (this: CustomWorld) {
  const cancelButton = this.page!.locator('[data-testid="cancel-delete-all-button"]');
  await waitForVisible(cancelButton);
  await cancelButton.click();

  // Wait for the modal to close
  const dialog = this.page!.locator('[role="dialog"]');
  await waitForHidden(dialog);
});
