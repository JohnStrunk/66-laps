import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForHidden, waitForVisible } from '../../support/utils';

When('I confirm the deletion', async function (this: CustomWorld) {
  const confirmButton = this.page!.locator('[data-testid="confirm-delete-button"]');
  await waitForVisible(confirmButton);
  await confirmButton.click();

  // Wait for the modal to close
  const dialog = this.page!.locator('[role="dialog"]');
  await waitForHidden(dialog);
});
