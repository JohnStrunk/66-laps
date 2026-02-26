import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('I should see lane headers from {int} to {int}', async function (this: CustomWorld, start: number, end: number) {
  for (let n = start; n <= end; n++) {
    const header = this.page!.locator(`[data-testid="lane-header-${n}"]`);
    assert(await header.isVisible(), `Lane header ${n} should be visible`);
    assert.strictEqual(await header.textContent(), n.toString());
  }
});
