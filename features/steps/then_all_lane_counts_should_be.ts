import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Then('all lane counts should be {int}', async function (this: CustomWorld, count: number) {
  await this.page!.waitForFunction(
    (c) => {
      const el = document.querySelector('[data-lane-number="1"] [data-testid="lane-count"]');
      const val = el ? parseInt(el.textContent || '0', 10) : 0;
      return val === c;
    },
    count
  );
  const text = await this.page!.locator('[data-lane-number="1"] [data-testid="lane-count"]').textContent();
  assert.strictEqual(parseInt(text || '0', 10), count);
});
