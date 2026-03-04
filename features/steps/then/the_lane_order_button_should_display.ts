import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the lane order button should display {string}', async function (this: CustomWorld, expectedText: string) {
  const button = this.page!.locator('button[aria-label="Lane Order"]');
  const text = await button.textContent();
  expect(text?.includes(expectedText), `Expected lane order button to contain "${expectedText}", but got "${text}"`).toBeTruthy();
});
