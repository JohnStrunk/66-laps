import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('the lane stack should be ordered {int} to {int}', async function (this: CustomWorld, start: number, end: number) {
  const rows = this.page!.locator('[data-testid="lane-row"]');
  await this.page!.waitForFunction(
    (args) => {
      const els = document.querySelectorAll('[data-testid="lane-row"]');
      return els[0]?.getAttribute('data-lane-number') === args.s &&
             els[els.length-1]?.getAttribute('data-lane-number') === args.e;
    },
    { s: String(start), e: String(end) }
  );
  const firstAttr = await rows.first().getAttribute('data-lane-number');
  assert.strictEqual(firstAttr, String(start));
});
