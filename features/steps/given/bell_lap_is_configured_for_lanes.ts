import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { BASE_URL } from '../../support/utils';

Given('Bell Lap is configured for a/an {int}-lane event', async function (this: CustomWorld, laneCount: number) {
  await this.page!.goto(`${BASE_URL}/app?lanes=${laneCount}&testMode=true`);
  await this.page!.waitForSelector('[data-testid="lane-row"]');
});
