import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock } from '../../support/utils';
import assert from 'node:assert';

Then('the {string} dialog should be closed', async function (this: CustomWorld, dialogTitle: string) {
  const dialog = this.page!.getByTestId('new-race-setup-dialog');

  // Advance clock in ticks until hidden or timeout
  for (let i = 0; i < 20; i++) {
    if (!(await dialog.isVisible())) break;
    await advanceClock(this.page!, 200);
  }

  await dialog.waitFor({ state: 'hidden', timeout: 5000 });
  assert.ok(!(await dialog.isVisible()), `Expected "${dialogTitle}" dialog to be closed`);
});
