import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Then('a confirmation modal should appear with the title {string}', async function (this: CustomWorld, title: string) {
  const modalHeader = this.page!.locator('header:has-text("' + title + '")');
  await modalHeader.waitFor({ state: 'visible' });
  assert.ok(await modalHeader.isVisible());
});
