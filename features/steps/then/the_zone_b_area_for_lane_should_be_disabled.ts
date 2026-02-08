import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then(`the Zone B area for Lane {int} should be disabled`, async function (this: CustomWorld, laneNumber: number) {
  const zoneB = await this.page!.$(`[data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"]`);
  assert.ok(zoneB, `Zone B for lane ${laneNumber} not found`);
  const classes = await zoneB.getAttribute('class');
  assert.ok(classes?.includes('pointer-events-none'), `Zone B for lane ${laneNumber} is not disabled (missing pointer-events-none). Classes: ${classes}`);
});
