import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Given('the {string} dialog is open', async function (this: CustomWorld, _dialogTitle: string) {
  const dialog = this.page!.getByTestId('new-race-setup-dialog');

  if (!(await dialog.isVisible())) {
    const resetButton = this.page!.getByLabel('Reset');
    await resetButton.waitFor({ state: 'visible' });
    await resetButton.click({ force: true });
    // Wait for animation
    await this.page!.waitForTimeout(1000);
  }

  await dialog.waitFor({ state: 'visible', timeout: 10000 });
  assert.ok(await dialog.isVisible(), `Expected dialog to be visible`);
});
