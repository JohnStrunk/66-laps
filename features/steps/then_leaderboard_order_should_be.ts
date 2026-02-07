import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Then('the order in the Leaderboard should be Lane {int}, Lane {int}, Lane {int}', async function (this: CustomWorld, l1: number, l2: number, l3: number) {
  await this.page!.waitForFunction(
    (args) => {
      const els = Array.from(document.querySelectorAll('[data-testid^="leaderboard-lane-"]'));
      return els.length >= 3 && els[0].textContent === args.l1 && els[1].textContent === args.l2 && els[2].textContent === args.l3;
    },
    { l1: String(l1), l2: String(l2), l3: String(l3) },
    { timeout: 5000 }
  );
  const texts = await this.page!.locator('[data-testid^="leaderboard-lane-"]').allTextContents();
  assert.strictEqual(texts[0], String(l1));
  assert.strictEqual(texts[1], String(l2));
  assert.strictEqual(texts[2], String(l3));
});
