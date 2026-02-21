import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I tap the {string} button', async function (this: CustomWorld, buttonName: string) {
  if (buttonName === "New Race") {
    // Try data-testid first, then text
    const btn = this.page!.locator('[data-testid="new-race-button"]');
    if (await btn.count() > 0) {
      await btn.click({ force: true });
    } else {
      await this.page!.click(`button:has-text("${buttonName}")`, { force: true });
    }
  } else if (buttonName === "History") {
    await this.page!.click('[data-testid="history-button"]', { force: true });
    // Wait for view transition
    await this.page!.waitForTimeout(500);
  } else if (buttonName === "Exit") {
    // Handle both history exit and race exit if they have different test IDs,
    // but they should probably share a common way to identify or use the test ID passed in the step?
    // The step says "I tap the "Exit" button in the header".
    // I should probably have a separate step for "in the header".
    // But for "I tap the "Exit" button", let's look for any exit button.
    const exitBtn = this.page!.locator('[aria-label="Exit to Main Menu"]');
    await exitBtn.first().click({ force: true });
  } else if (buttonName === "Reset") {
    // Keep for backward compatibility if any, but it should be removed
    await this.page!.click('button[aria-label="Reset"]', { force: true });
  } else {
    await this.page!.click(`button:has-text("${buttonName}")`, { force: true });
  }
});
