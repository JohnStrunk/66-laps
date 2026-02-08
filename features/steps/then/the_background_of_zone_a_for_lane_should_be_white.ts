import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then(`the background of Zone A for Lane {int} should be white`, async function (this: CustomWorld, laneNumber: number) {
  const zoneA = await this.page!.$(`[data-lane-number="${laneNumber}"] [data-testid="lane-zone-a"]`);
  assert.ok(zoneA, `Zone A for lane ${laneNumber} not found`);
  const classes = await zoneA.getAttribute('class');
  assert.ok(classes?.includes('bg-white'), `Zone A for lane ${laneNumber} is not white. Classes: ${classes}`);
});
