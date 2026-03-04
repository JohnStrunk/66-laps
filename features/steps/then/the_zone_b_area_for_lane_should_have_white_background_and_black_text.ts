import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then(`the Zone B area for Lane {int} should have white background and black text`, async function (this: CustomWorld, laneNumber: number) {
  const zoneB = await this.page!.$(`[data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"]`);
  expect(zoneB, `Zone B for lane ${laneNumber} not found`).toBeTruthy();
  const classes = await zoneB!.getAttribute('class');
  expect(classes?.includes('bg-white'), `Zone B for lane ${laneNumber} is not white. Classes: ${classes}`).toBeTruthy();

  const span = await zoneB!.$('span');
  const spanClasses = await span?.getAttribute('class');
  expect(spanClasses?.includes('text-black'), `Text in Zone B for lane ${laneNumber} is not black. Classes: ${spanClasses}`).toBeTruthy();
});
