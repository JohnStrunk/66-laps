import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then(`the Zone B area for Lane {int} should not display a progress indicator for the lockout duration`, async function (this: CustomWorld, laneNumber: number) {
  const progress = await this.page!.$(`[data-lane-number="${laneNumber}"] [data-testid="lockout-progress"]`);
  assert.ok(!progress, `Progress indicator for lane ${laneNumber} should not be found`);
});
