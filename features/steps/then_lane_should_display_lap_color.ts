import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';
import { getColorClass } from '../support/utils';

Then('Lane {int} should display the color associated with Lap {int}', async function (this: CustomWorld, lane: number, lap: number) {
  const c = await this.page!.locator(`[data-testid="leaderboard-lane-${lane}"]`).getAttribute('class');
  const color = getColorClass(c);
  assert.ok(color && color !== 'text-success' && color !== 'text-foreground/50', `Lane ${lane} should have lap color for lap ${lap}, got ${color}`);
});
