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

  const btn = this.page!.locator(selector);
  await btn.waitFor({ state: 'visible', timeout: 5000 });

  // Ensure the button is fully interactive
  for (let i = 0; i < 5; i++) {
    if (await btn.isEnabled()) break;
    await advanceClock(this.page!, 200);
  }

  await btn.click();

  // Wait for the modal close animation to finish.
  const dialog = this.page!.locator('[role="dialog"], [data-testid="new-race-setup-dialog"]');
  await waitForHidden(dialog);
});
