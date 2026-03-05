import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForHidden, advanceClock } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the {string} dialog should be closed', async function (this: CustomWorld, dialogTitle: string) {
  const page = this.page!;
  const dialog = page.locator('[data-testid="new-race-setup-dialog"]');

  // Wait for it to be hidden using our robust helper
  await waitForHidden(dialog);

  // Final verification
  const isVisible = await dialog.isVisible();
  if (isVisible) {
    // One last try with clock advancement
    await advanceClock(page, 1000);
    if (await dialog.isVisible()) {
      throw new Error(`Expected "${dialogTitle}" dialog to be closed, but it is still visible`);
    }
  }
});
