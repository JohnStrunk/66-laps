import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('I should see the text {string} on the screen', async function (this: CustomWorld, text: string) {
  const isVisible = await this.page!.locator(`text="${text}"`).first().isVisible();
  assert.ok(isVisible, `Expected to see text "${text}" on the screen`);
});
