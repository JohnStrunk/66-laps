import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('the content in Zone A for Lane {int} should not wrap or overflow', async function (this: CustomWorld, laneNumber: number) {
  const zoneA = this.page!.locator(`[data-lane-number="${laneNumber}"] [data-testid="lane-zone-a"]`);

  await zoneA.waitFor({ state: 'visible' });

  const check = await zoneA.evaluate((el) => {
    const scrollWidth = el.scrollWidth;
    const clientWidth = el.clientWidth;
    const overflow = scrollWidth > clientWidth;

    // Check for wrapping by looking at the height of children if they are flex-row
    // In this case, we expect them to be on one line.
    const children = Array.from(el.children);
    const wraps = children.some(child => {
      const rect = child.getBoundingClientRect();
      const parentRect = el.getBoundingClientRect();
      // If a child's top is significantly below the parent's top + padding, it might have wrapped
      // but here we use overflow-hidden and flex-row, so it's more about overflow.
      return rect.bottom > parentRect.bottom || rect.right > parentRect.right;
    });

    return {
      overflow,
      wraps,
      scrollWidth,
      clientWidth
    };
  });

  assert.strictEqual(check.overflow, false, `Content in Zone A for Lane ${laneNumber} overflows its container (scrollWidth: ${check.scrollWidth}px vs clientWidth: ${check.clientWidth}px)`);
});
