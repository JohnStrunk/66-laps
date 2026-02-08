import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { longPress } from '../../support/utils';

When('I long press the Zone B area for Lane {int}', async function (this: CustomWorld, laneNumber: number) {
  const zoneB = this.page!.locator(`[data-testid="lane-row"][data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"]`);
  await longPress(zoneB);
});
