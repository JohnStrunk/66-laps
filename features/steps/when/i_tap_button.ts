import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock } from '../../support/utils';

When('I tap the {string} button', async function (this: CustomWorld, buttonName: string) {
  if (buttonName === "New Race") {
    // Try data-testid first, then text
    const btn = this.page!.locator('[data-testid="new-race-button"]');
    if (await btn.count() > 0) {
      await btn.click({ force: true });
    } else {
      await this.page!.click(`button:has-text("${buttonName}")`, { force: true });
    }
    // New Race button opens a modal
    await advanceClock(this.page!, 500);
  } else if (buttonName === "History") {
    await this.page!.click('[data-testid="history-button"]', { force: true });
    await advanceClock(this.page!, 500);
    // Wait for view transition by waiting for a key element in the history view
    await this.page!.waitForSelector('[data-testid="history-view"]', { state: 'visible', timeout: 5000 }).catch(() => {});
  } else if (buttonName === "Exit") {
    const exitBtn = this.page!.locator('[aria-label="Exit to Main Menu"]');
    await exitBtn.first().click({ force: true });
    await advanceClock(this.page!, 500);
  } else if (buttonName === "Reset") {
    await this.page!.click('button[aria-label="Reset"]', { force: true });
    await advanceClock(this.page!, 500);
  } else {
    await this.page!.click(`button:has-text("${buttonName}")`, { force: true });
    await advanceClock(this.page!, 500);
  }
});
