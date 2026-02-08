import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('Lane {int} should be displayed as a full-width empty state', async function (this: CustomWorld, laneNumber: number) {
  const row = this.page!.locator(`[data-testid="lane-row"][data-lane-number="${laneNumber}"]`);
  const emptyState = row.locator('[data-testid="lane-empty-state"]');
  await emptyState.waitFor({ state: 'visible' });

  const zoneA = row.locator('[data-testid="lane-zone-a"]');
  const zoneB = row.locator('[data-testid="lane-zone-b"]');

  assert.ok(await emptyState.isVisible(), 'Empty state should be visible');
  assert.ok(!(await zoneA.isVisible()), 'Zone A should not be visible');
  assert.ok(!(await zoneB.isVisible()), 'Zone B should not be visible');

  const text = await emptyState.textContent();
  assert.ok(text?.includes('EMPTY'), 'Should display EMPTY text');

  const classes = await row.getAttribute('class');
  assert.ok(classes?.includes('bg-content2'), 'Background should be grey (bg-content2)');
});
