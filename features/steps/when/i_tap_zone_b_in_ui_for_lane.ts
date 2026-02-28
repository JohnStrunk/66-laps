import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I tap the Zone B area for Lane {int} in the UI', async function (this: CustomWorld, laneNumber: number) {
  const zoneB = this.page!.locator(`[data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"]`);
  await zoneB.click({ force: true });
});
