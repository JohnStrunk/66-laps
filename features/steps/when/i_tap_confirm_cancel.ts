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

  // Ensure the button is fully interactive
  for (let i = 0; i < 5; i++) {
    if (await btn.isEnabled()) break;
    await advanceClock(this.page!, 200);
  }

  await btn.click();

  // Wait for the modal close animation to finish.
  // We use multiple small ticks to help Framer Motion animations settle if the clock is mocked.
  const dialog = this.page!.locator('[role="dialog"], [data-testid="new-race-setup-dialog"]');
  for (let i = 0; i < 20; i++) {
    if (await dialog.count() === 0 || !(await dialog.first().isVisible())) break;
    await advanceClock(this.page!, 200);
  }

  // Final wait for it to be fully hidden
  await dialog.first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
});
