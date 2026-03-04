import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then(`the aria-label for Lane {int}'s Zone B should include {string}`, async function (this: CustomWorld, laneNumber: number, expectedText: string) {
  const zoneB = this.page!.locator(`[data-testid="lane-row"][data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"]`);
  await this.page!.waitForFunction(
    ({ lane, expected }) => {
      const el = document.querySelector(`[data-testid="lane-row"][data-lane-number="${lane}"] [data-testid="lane-zone-b"]`);
      return el?.getAttribute('aria-label')?.includes(expected);
    },
    { lane: laneNumber, expected: expectedText },
    { timeout: 5000 }
  );
  const ariaLabel = await zoneB.getAttribute('aria-label');
  expect(ariaLabel?.includes(expectedText), `Aria-label "${ariaLabel}" does not include "${expectedText}"`).toBeTruthy();
});
