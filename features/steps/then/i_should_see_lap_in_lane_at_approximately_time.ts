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
  expect(await locator.isVisible(), `Lap count ${lap} for lane ${lane} should be visible`).toBeTruthy();
  expect(await locator.textContent()).toBe(lap);

  const style = await locator.getAttribute('style');
  const topMatch = style?.match(/top:\s*([\d.]+)px/);
  expect(topMatch, `Could not find top position in style: ${style}`).toBeTruthy();

  const actualTop = parseFloat(topMatch![1]);
  const diff = Math.abs(actualTop - expectedTop);

  expect(diff < 5, `Expected top around ${expectedTop}px, but got ${actualTop}px (diff: ${diff}px).toBeTruthy();`);
});
