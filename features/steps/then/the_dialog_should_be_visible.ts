import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('the {string} dialog should be visible', async function (this: CustomWorld, dialogTitle: string) {
  const dialog = this.page!.getByTestId('new-race-setup-dialog');
  await dialog.waitFor({ state: 'visible' });
  const header = dialog.locator('header');
  const headerText = await header.textContent();
  assert.ok(headerText?.includes(dialogTitle), `Expected dialog title to include "${dialogTitle}", but got "${headerText}"`);
});
