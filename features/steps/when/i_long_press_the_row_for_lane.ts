import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { longPress } from '../../support/utils';

When('I long press the row for Lane {int}', async function (this: CustomWorld, laneNumber: number) {
  const row = this.page!.locator(`[data-testid="lane-row"][data-lane-number="${laneNumber}"]`);
  await longPress(row);
});
