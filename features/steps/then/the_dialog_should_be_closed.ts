import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
Then('the {string} dialog should be closed', async function (this: CustomWorld, _: string) {
  const dialog = this.page!.getByTestId('new-race-setup-dialog');
  await dialog.waitFor({ state: 'hidden' });
  assert.ok(!(await dialog.isVisible()));
});
