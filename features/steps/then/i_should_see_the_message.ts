import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('I should see the {string} message', async function (this: CustomWorld, message: string) {
  const element = this.page!.getByText(message);
  await element.waitFor({ state: 'visible' });
  assert.ok(await element.isVisible());
});
