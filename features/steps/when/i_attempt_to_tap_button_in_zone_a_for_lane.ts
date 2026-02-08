import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I attempt to tap the {string} button in Zone A for Lane {int}', async function (this: CustomWorld, button: string, laneNumber: number) {
  const action = button === '+' ? 'Increment' : 'Decrement';
  const btn = this.page!.locator(`button[aria-label="${action} lane ${laneNumber}"]`);
  // Use force: true to bypass actionability checks (like being disabled)
  await btn.click({ force: true, timeout: 1000 }).catch(() => {
    // Ignore errors if it's still not clickable for some reason,
    // we just want to "attempt" it.
  });
});
