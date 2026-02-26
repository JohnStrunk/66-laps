import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('I should see a time label for {string}', async function (this: CustomWorld, time: string) {
  const label = this.page!.locator(`[data-testid="time-label-${time}"]`);
  assert(await label.isVisible(), `Time label ${time} should be visible`);
  assert.strictEqual(await label.textContent(), time);
});
