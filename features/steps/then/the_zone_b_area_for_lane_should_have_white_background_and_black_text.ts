import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then(`the Zone B area for Lane {int} should have white background and black text`, async function (this: CustomWorld, laneNumber: number) {
  const zoneB = await this.page!.$(`[data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"]`);
  assert.ok(zoneB, `Zone B for lane ${laneNumber} not found`);
  const classes = await zoneB.getAttribute('class');
  assert.ok(classes?.includes('bg-white'), `Zone B for lane ${laneNumber} is not white. Classes: ${classes}`);

  const span = await zoneB.$('span');
  const spanClasses = await span?.getAttribute('class');
  assert.ok(spanClasses?.includes('text-black'), `Text in Zone B for lane ${laneNumber} is not black. Classes: ${spanClasses}`);
});
