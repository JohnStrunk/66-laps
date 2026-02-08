import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then(`the Zone B area for Lane {int} should display {string}`, async function (this: CustomWorld, laneNumber: number, expectedText: string) {
  const zoneB = await this.page!.$(`[data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"]`);
  const text = await zoneB?.textContent();

  // Use case-sensitive matching if emojis are present, otherwise stay case-insensitive for text
  // Using \p{Extended_Pictographic} for better emoji detection including squares
  const hasEmoji = /\p{Extended_Pictographic}/u.test(expectedText);
  const match = hasEmoji
    ? text?.includes(expectedText)
    : text?.toUpperCase().includes(expectedText.toUpperCase());

  assert.ok(match, `Text "${expectedText}" not found in Zone B for lane ${laneNumber}. Found: "${text}"`);
});
