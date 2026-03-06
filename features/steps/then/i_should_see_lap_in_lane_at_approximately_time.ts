import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('I should see {string} in lane {int} at approximately {string}', async function (this: CustomWorld, lap: string, lane: number, timeStr: string) {
  const [mins, secs] = timeStr.split(':').map(Number);
  const totalSeconds = (mins * 60) + secs;

  const SECONDS_PER_LINE = 15;
  const LINE_HEIGHT = 24;
  const expectedTop = (totalSeconds / SECONDS_PER_LINE) * LINE_HEIGHT + (LINE_HEIGHT / 2);

  const locator = this.page!.locator(`[data-testid="lap-count-${lane}-${lap}"]`);
  await expect(locator).toBeVisible();
  await expect(locator).toHaveText(lap);

  await expect.poll(async () => {
    const style = await locator.getAttribute('style');
    const topMatch = style?.match(/top:\s*([\d.]+)px/);
    if (!topMatch) return false;
    const actualTop = parseFloat(topMatch[1]);
    const diff = Math.abs(actualTop - expectedTop);
    return diff < 5;
  }, { timeout: 5000 }).toBe(true);
});
