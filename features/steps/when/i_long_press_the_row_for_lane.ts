import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { longPress } from '../../support/utils';

When('I long press the row for Lane {int}', async function (this: CustomWorld, laneNumber: number) {
  const row = this.page!.locator(`[data-testid="lane-row"][data-lane-number="${laneNumber}"]`);
  const zoneB = row.locator('[data-testid="lane-zone-b"]');
  if (await zoneB.isVisible()) {
    await longPress(zoneB);
  } else {
    await longPress(row);
  }
});
