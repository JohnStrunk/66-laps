import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the text in Zone B for Lane {int} should not wrap or overflow', async function (this: CustomWorld, laneNumber: number) {
  const zoneB = this.page!.locator(`[data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"]`);
  const textSpan = zoneB.locator('span');

  await expect(textSpan).toBeVisible();

  await expect.poll(async () => {
    return await textSpan.evaluate((el) => {
      const parent = el.parentElement;
      if (!parent) return { overflow: false, wraps: false };

      const style = window.getComputedStyle(el);
      let lh = parseFloat(style.lineHeight);
      if (isNaN(lh)) {
        lh = parseFloat(style.fontSize) * 1.2;
      }

      const height = el.getBoundingClientRect().height;
      const overflow = el.scrollWidth > parent.clientWidth;
      const wraps = height > lh * 1.2;

      return { overflow, wraps };
    });
  }, { timeout: 5000 }).toMatchObject({ overflow: false, wraps: false });
});
