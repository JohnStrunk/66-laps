import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('the modal should close', async function (this: CustomWorld) {
  const modal = this.page!.locator('header:has-text("Start New Race?")');
  await modal.waitFor({ state: 'hidden', timeout: 5000 });
  assert.ok(!(await modal.isVisible()));
});
