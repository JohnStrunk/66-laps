import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('the {string} dialog should be closed', async function (this: CustomWorld, dialogTitle: string) {
  const dialog = this.page!.getByTestId('new-race-setup-dialog');
  await dialog.waitFor({ state: 'hidden' });
  assert.ok(!(await dialog.isVisible()), `Expected "${dialogTitle}" dialog to be closed`);
});
