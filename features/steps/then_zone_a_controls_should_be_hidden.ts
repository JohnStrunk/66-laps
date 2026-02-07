import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Then('Zone A controls for Lane {int} should be hidden', async function (this: CustomWorld, laneNumber: number) {
  const zoneA = this.page!.locator(`[data-testid="lane-row"][data-lane-number="${laneNumber}"] [data-testid="lane-zone-a"]`);
  const isVisible = await zoneA.isVisible();
  assert.ok(!isVisible || (await zoneA.getAttribute('class'))?.includes('invisible'));
});
