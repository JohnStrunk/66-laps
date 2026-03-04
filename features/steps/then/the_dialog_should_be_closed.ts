import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForHidden } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the {string} dialog should be closed', async function (this: CustomWorld, dialogTitle: string) {
  const dialog = this.page!.getByTestId('new-race-setup-dialog');
  await waitForHidden(dialog);
  await expect(dialog).toBeHidden();
  expect(!(await dialog.isVisible()), `Expected "${dialogTitle}" dialog to be closed`).toBeTruthy();
});
