import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForHidden } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the {string} dialog should be closed', async function (this: CustomWorld, dialogTitle: string) {
  // Let's use getByRole so it maps to the dialog matching the title string or fallback to the previous behaviour for backwards compat
  const dialogByRole = this.page!.getByRole('dialog', { name: dialogTitle });
  let dialog = dialogByRole;

  // In some cases dialogs might not have exact names mapped correctly by ARIA attributes, so let's provide a fallback mapped test id
  if (dialogTitle === 'New Race Setup') {
    const dialogById = this.page!.getByTestId('new-race-setup-dialog');
    dialog = (await dialogById.count() > 0 || await dialogById.isHidden()) ? dialogById : dialogByRole;
  }

  await waitForHidden(dialog);
  await expect(dialog).toBeHidden();
});
