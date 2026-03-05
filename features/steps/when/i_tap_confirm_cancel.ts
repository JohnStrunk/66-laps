import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock, waitForHidden, waitForVisible } from '../../support/utils';

When('I tap the {string} setup button', async function (this: CustomWorld, buttonText: string) {
  let selector = '';
  if (buttonText === "Start Race") {
    selector = '[data-testid="start-race-button"]';
  } else if (buttonText === "Update Race") {
    selector = '[data-testid="start-race-button"]';
  } else if (buttonText === "Cancel") {
    selector = '[data-testid="cancel-setup-button"]';
  } else {
    selector = `button:has-text("${buttonText}")`;
  }

  const page = this.page!;

  // Wait for any animations to settle
  await advanceClock(page, 500);
  await page.waitForTimeout(100);

  const btn = page.locator(selector).first();
  await waitForVisible(btn);

  // Use a more direct click approach that bypasses some of Playwright's checks
  // but still triggers HeroUI handlers.
  await btn.click({ force: true });

  // Allow for state transition
  for (let i = 0; i < 10; i++) {
    await advanceClock(page, 200);
    await page.waitForTimeout(20);
    const dialog = page.locator('[data-testid="new-race-setup-dialog"]');
    if (!(await dialog.isVisible())) break;
  }

  // Final wait for hidden
  const dialog = page.locator('[data-testid="new-race-setup-dialog"]');
  await waitForHidden(dialog);});
