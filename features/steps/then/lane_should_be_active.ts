import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('Lane {int} should be active', async function (this: CustomWorld, laneNumber: number) {
  const row = this.page!.locator(`[data-testid="lane-row"][data-lane-number="${laneNumber}"]`);

  // Wait for the EMPTY state to disappear if it was there
  await this.page!.waitForFunction(
    (lane) => {
      const el = document.querySelector(`[data-testid="lane-row"][data-lane-number="${lane}"]`);
      return el && !el.textContent?.includes('EMPTY');
    },
    laneNumber,
    { timeout: 5000 }
  );

  const text = await row.textContent();
  assert.ok(!text?.includes('EMPTY'), `Lane ${laneNumber} should be active (not contain EMPTY)`);
});
