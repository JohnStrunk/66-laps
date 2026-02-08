import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('the text in Zone B for Lane {int} should not wrap or overflow', async function (this: CustomWorld, laneNumber: number) {
  const zoneB = this.page!.locator(`[data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"]`);
  const textSpan = zoneB.locator('span');

  await textSpan.waitFor({ state: 'visible' });

  const check = await textSpan.evaluate((el) => {
    const parent = el.parentElement;
    if (!parent) return { overflow: false, wraps: false, scrollWidth: 0, clientWidth: 0, height: 0, lineHeight: 0 };

    const style = window.getComputedStyle(el);
    // If line-height is 'normal', we can approximate it or use a default.
    // But Tailwind's text-xl/text-3xl usually set a specific line-height.
    let lh = parseFloat(style.lineHeight);
    if (isNaN(lh)) {
      lh = parseFloat(style.fontSize) * 1.2; // fallback
    }

    const height = el.getBoundingClientRect().height;
    const overflow = el.scrollWidth > parent.clientWidth;
    const wraps = height > lh * 1.2; // 20% tolerance

    return {
      overflow,
      wraps,
      scrollWidth: el.scrollWidth,
      clientWidth: parent.clientWidth,
      height,
      lineHeight: lh
    };
  });

  const text = await textSpan.textContent();
  assert.strictEqual(check.wraps, false, `Text "${text}" in Zone B for Lane ${laneNumber} wrapped to multiple lines (height: ${check.height}px, line-height: ${check.lineHeight}px)`);
  assert.strictEqual(check.overflow, false, `Text "${text}" in Zone B for Lane ${laneNumber} overflows its container (width: ${check.scrollWidth}px vs parent: ${check.clientWidth}px)`);
});
