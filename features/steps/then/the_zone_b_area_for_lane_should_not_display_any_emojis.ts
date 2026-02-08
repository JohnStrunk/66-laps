import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then(`the Zone B area for Lane {int} should not display any emojis`, async function (this: CustomWorld, laneNumber: number) {
  const zoneB = await this.page!.$(`[data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"]`);
  const text = await zoneB?.textContent();
  const emojis = ["🔔", "🟥", "🏁"];
  for (const emoji of emojis) {
    assert.ok(!text?.includes(emoji), `Emoji ${emoji} found in Zone B for lane ${laneNumber}. Found: ${text}`);
  }
});
