import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('I should see {string} in lane {int} at approximately {string}', async function (this: CustomWorld, lap: string, lane: number, timeStr: string) {
  const [mins, secs] = timeStr.split(':').map(Number);
  const totalSeconds = (mins * 60) + secs;

  const SECONDS_PER_LINE = 15;
  const LINE_HEIGHT = 24;
  const expectedTop = (totalSeconds / SECONDS_PER_LINE) * LINE_HEIGHT + (LINE_HEIGHT / 2);

  const locator = this.page!.locator(`[data-testid="lap-count-${lane}-${lap}"]`);
  assert(await locator.isVisible(), `Lap count ${lap} for lane ${lane} should be visible`);
  assert.strictEqual(await locator.textContent(), lap);

  const style = await locator.getAttribute('style');
  const topMatch = style?.match(/top:\s*([\d.]+)px/);
  assert(topMatch, `Could not find top position in style: ${style}`);

  const actualTop = parseFloat(topMatch[1]);
  const diff = Math.abs(actualTop - expectedTop);

  assert(diff < 5, `Expected top around ${expectedTop}px, but got ${actualTop}px (diff: ${diff}px)`);
});
