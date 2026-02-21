import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Given('the {string} dialog is open', async function (this: CustomWorld, dialogTitle: string) {
  const dialog = this.page!.getByTestId('new-race-setup-dialog');

  if (!(await dialog.isVisible())) {
    const resetButton = this.page!.getByLabel('Reset');
    await resetButton.waitFor({ state: 'visible' });
    await resetButton.click({ force: true });
    // Wait for animation
    await this.page!.waitForTimeout(1000);
  }

  await dialog.waitFor({ state: 'visible', timeout: 10000 });
  const header = dialog.locator('header, [role="heading"]');
  const headerText = await header.first().textContent();
  assert.ok(headerText?.includes(dialogTitle), `Expected dialog to have title "${dialogTitle}", but found "${headerText}"`);
});
