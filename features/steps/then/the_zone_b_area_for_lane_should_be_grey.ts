import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then(`the Zone B area for Lane {int} should be grey`, async function (this: CustomWorld, laneNumber: number) {
  const zoneB = await this.page!.$(`[data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"]`);
  assert.ok(zoneB, `Zone B for lane ${laneNumber} not found`);
  const classes = await zoneB.getAttribute('class');
  assert.ok(classes?.includes('bg-content2'), `Zone B for lane ${laneNumber} is not grey. Classes: ${classes}`);
});
