import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the background of Lane {int} should be darker', async function (this: CustomWorld, laneNumber: number) {
  const laneRow = this.page!.locator(`[data-testid="lane-row"][data-lane-number="${laneNumber}"]`);
  await expect(laneRow).toBeVisible();

  // This step assumes we just toggled to dark mode.
  // We'll check if the current background is darker than the neutral-200 (approx rgb(229, 229, 229))
  const bgColor = await laneRow.evaluate((el) => window.getComputedStyle(el).backgroundColor);

  // Parse rgb/rgba or lab
  const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  const labMatch = bgColor.match(/lab\((\d+\.?\d*)/);

  if (rgbMatch) {
    const [, r, g, b] = rgbMatch.map(Number);
    // Darker means lower RGB values. neutral-200 is 229,229,229.
    expect(r < 100 && g < 100 && b < 100, `Expected background to be dark (RGB), but got ${bgColor}`).toBeTruthy();
  } else if (labMatch) {
    const lValue = parseFloat(labMatch[1]);
    // LAB Lightness ranges from 0 to 100.
    expect(lValue < 30, `Expected background to be dark (LAB), but got ${bgColor} (Lightness: ${lValue})`).toBeTruthy();
  } else {
    expect(true, `Unexpected background color format: ${bgColor}`).toBe(false);
  }
});
