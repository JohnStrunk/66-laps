import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I tap the row for Lane {int} in the UI', async function (this: CustomWorld, laneNumber: number) {
  const row = this.page!.locator(`[data-testid="lane-row"][data-lane-number="${laneNumber}"]`);
  await row.click();
});
