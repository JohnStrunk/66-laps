import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then(`the Zone B area for Lane {int} should display {string}`, async function (this: CustomWorld, laneNumber: number, expectedText: string) {
  const zoneB = await this.page!.$(`[data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"]`);
  const text = await zoneB?.textContent();
  assert.ok(text?.toUpperCase().includes(expectedText.toUpperCase()), `Text "${expectedText}" not found in Zone B for lane ${laneNumber}. Found: ${text}`);
});
