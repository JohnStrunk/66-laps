import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Then(`each lane's Zone B should not display the current lap count`, async function (this: CustomWorld) {
  const zoneBs = await this.page!.$$('[data-testid="lane-zone-b"]');
  for (const zoneB of zoneBs) {
    const lapCount = await zoneB.$('[data-testid="lane-count"]');
    assert.strictEqual(lapCount, null, 'Zone B should not contain lap count element');
  }
});

Then(`each lane's Zone A should display the current lap count prominently`, async function (this: CustomWorld) {
  const zoneAs = await this.page!.$$('[data-testid="lane-zone-a"]');
  for (const zoneA of zoneAs) {
    const isVisible = await zoneA.isVisible();
    if (isVisible) {
      const lapCount = await zoneA.$('[data-testid="lane-count"]');
      assert.ok(lapCount, 'Zone A should contain lap count element');
      const classes = await lapCount.getAttribute('class');
      assert.ok(classes?.includes('text-4xl'), 'Lap count should be prominent (text-4xl)');
    }
  }
});

Then(`the Zone B area for Lane {int} should be green`, async function (this: CustomWorld, laneNumber: number) {
  const zoneB = await this.page!.$(`[data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"]`);
  assert.ok(zoneB, `Zone B for lane ${laneNumber} not found`);
  const classes = await zoneB.getAttribute('class');
  assert.ok(classes?.includes('bg-success'), `Zone B for lane ${laneNumber} is not green. Classes: ${classes}`);
});

Then(`the Zone B area for Lane {int} should be in lockout state`, async function (this: CustomWorld, laneNumber: number) {
  const zoneB = await this.page!.$(`[data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"]`);
  assert.ok(zoneB, `Zone B for lane ${laneNumber} not found`);
  const classes = await zoneB.getAttribute('class');
  assert.ok(classes?.includes('bg-content3') || classes?.includes('cursor-wait'), `Zone B for lane ${laneNumber} is not in lockout state. Classes: ${classes}`);
});

Then(`the Zone B area for Lane {int} should display a progress indicator for the lockout duration`, async function (this: CustomWorld, laneNumber: number) {
  const progress = await this.page!.$(`[data-lane-number="${laneNumber}"] [data-testid="lockout-progress"]`);
  assert.ok(progress, `Progress indicator for lane ${laneNumber} not found`);
});

Then(`the Zone B area for Lane {int} should be grey`, async function (this: CustomWorld, laneNumber: number) {
  const zoneB = await this.page!.$(`[data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"]`);
  assert.ok(zoneB, `Zone B for lane ${laneNumber} not found`);
  const classes = await zoneB.getAttribute('class');
  assert.ok(classes?.includes('bg-content2'), `Zone B for lane ${laneNumber} is not grey. Classes: ${classes}`);
});

Then(`the Zone B area for Lane {int} should display {string}`, async function (this: CustomWorld, laneNumber: number, expectedText: string) {
  const zoneB = await this.page!.$(`[data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"]`);
  const text = await zoneB?.textContent();
  assert.ok(text?.toUpperCase().includes(expectedText.toUpperCase()), `Text "${expectedText}" not found in Zone B for lane ${laneNumber}. Found: ${text}`);
});
