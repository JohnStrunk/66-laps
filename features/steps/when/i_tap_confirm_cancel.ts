import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock } from '../../support/utils';

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

  await btn.click({ force: true });

  // Wait for potential modal close animation to finish
  await advanceClock(this.page!, 500);

  // The setup modal has a data-testid or role="dialog"
  await this.page!.locator('[role="dialog"], [data-testid="new-race-setup-dialog"]').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
});
