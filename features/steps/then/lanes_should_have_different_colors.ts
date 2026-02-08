import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';
import { getColorClass } from '../../support/utils';

Then('Lane {int} and Lane {int} should have different colors in the Leaderboard', async function (this: CustomWorld, l1: number, l2: number) {
  const c1 = await this.page!.locator(`[data-testid="leaderboard-lane-${l1}"]`).getAttribute('class');
  const c2 = await this.page!.locator(`[data-testid="leaderboard-lane-${l2}"]`).getAttribute('class');
  const color1 = getColorClass(c1);
  const color2 = getColorClass(c2);
  assert.notStrictEqual(color1, color2, `Lanes ${l1} and ${l2} should have different colors, but both are ${color1}`);
});
