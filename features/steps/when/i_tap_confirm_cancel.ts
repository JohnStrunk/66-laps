import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock, waitForHidden } from '../../support/utils';

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
  const btn = page.locator(selector);
  await btn.waitFor({ state: 'visible', timeout: 5000 });

  // Ensure the button is fully interactive
  for (let i = 0; i < 5; i++) {
    if (await btn.isEnabled()) break;
    await advanceClock(page, 200);
    await page.waitForTimeout(20);
  }

  // HeroUI onPress can be flaky with mock clocks.
  // Using dispatchEvent('click') is often more reliable for triggering these handlers.
  await btn.dispatchEvent('click');

  // Allow for state transition
  await advanceClock(page, 500);
  await page.waitForTimeout(100);

  // Wait for the modal close animation to finish.
  const dialog = page.locator('[role="dialog"], [data-testid="new-race-setup-dialog"]');
  await waitForHidden(dialog);
});
