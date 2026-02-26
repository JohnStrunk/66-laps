import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('I should see a time marker for {string}', async function (this: CustomWorld, time: string) {
  const marker = this.page!.locator(`[data-testid="time-marker-${time}"]`);
  assert(await marker.isVisible(), `Time marker for ${time} should be visible`);
});
