import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then(`the Zone B area for Lane {int} should display {string}`, async function (this: CustomWorld, laneNumber: number, expectedText: string) {
  const selector = `[data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"]`;

  // Use case-sensitive matching if emojis are present, otherwise stay case-insensitive for text
  const hasEmoji = /\p{Extended_Pictographic}/u.test(expectedText);

  // Wait for the text to appear to avoid race conditions
  await this.page!.waitForFunction((args) => {
    const el = document.querySelector(args.selector);
    const text = el?.textContent || '';
    if (args.hasEmoji) {
      return text.includes(args.expectedText);
    } else {
      return text.toUpperCase().includes(args.expectedText.toUpperCase());
    }
  }, { selector, expectedText, hasEmoji }, { timeout: 5000 });

  const zoneB = await this.page!.$(selector);
  const text = await zoneB?.textContent();
  const match = hasEmoji
    ? text?.includes(expectedText)
    : text?.toUpperCase().includes(expectedText.toUpperCase());

  assert.ok(match, `Text "${expectedText}" not found in Zone B for lane ${laneNumber}. Found: "${text}"`);
});
