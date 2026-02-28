import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock, waitForVisible } from '../../support/utils';

When('I tap the {string} button', async function (this: CustomWorld, buttonName: string) {
  let locator;
  if (buttonName === "New Race") {
    locator = this.page!.locator('[data-testid="new-race-button"]');
  } else if (buttonName === "History") {
    locator = this.page!.locator('[data-testid="history-button"]');
  } else if (buttonName === "Exit") {
    locator = this.page!.locator('[aria-label="Exit to Main Menu"]');
  } else if (buttonName === "Reset") {
    locator = this.page!.locator('button[aria-label="Reset"]');
  } else {
    locator = this.page!.locator(`button:has-text("${buttonName}")`);
  }

  // Robust click pattern
  await waitForVisible(locator);
  const btn = locator.first();

  // Ensure it's enabled
  for (let i = 0; i < 5; i++) {
    if (await btn.isEnabled()) break;
    await advanceClock(this.page!, 200);
  }

  await btn.click();
  await advanceClock(this.page!, 500);

  if (buttonName === "History") {
    // Wait for view transition
    await this.page!.waitForSelector('[data-testid="history-view"]', { state: 'visible', timeout: 5000 }).catch(() => {});
  }
});
