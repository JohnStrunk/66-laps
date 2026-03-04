import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('it should display the message {string} below the device', async function (this: CustomWorld, expectedMessage: string) {
  const messageEl = this.page!.locator('[data-testid="mobile-usage-message"]');
  await expect(messageEl).toBeVisible();
  const actualText = await messageEl.innerText();

  // Normalized expected message to match innerText which uses \n for newlines
  const normalizedExpected = expectedMessage.split('\\n').join('\n');

  expect(actualText, `Expected message "${normalizedExpected}" but got "${actualText}"`).toBe(normalizedExpected);
});
