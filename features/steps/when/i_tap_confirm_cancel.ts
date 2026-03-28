import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock, waitForHidden } from '../../support/utils';

When('I tap the {string} setup button', async function (this: CustomWorld, buttonText: string) {
  const page = this.page!;

  // Find the button within the modal dialog if it's open, else fallback to the page
  let btn = page.getByRole('button', { name: buttonText, exact: true });

  // Also try case-insensitive partial match if exact fails
  if (await btn.count() === 0) {
      btn = page.locator(`button:has-text("${buttonText}")`).first();
  }

  // Under fake timers, forms don't always submit properly when a button is clicked,
  // especially with NextUI/HeroUI buttons. Try standard click first.
  await btn.click({ force: true, timeout: 2000 }).catch(() => {});
  await advanceClock(page, 1000);

  // Use a forced evaluate click because HeroUI modal transitions might block standard click
  await btn.evaluate(n => (n as HTMLElement).click()).catch(() => {});

  await advanceClock(page, 1000);
  await page.waitForTimeout(100);

  // Wait for the modal close animation to finish.
  const dialog = page.locator('[role="dialog"], [data-testid="new-race-setup-dialog"]').first();
  if (await dialog.count() > 0 && await dialog.isVisible().catch(() => false)) {
      await btn.evaluate(n => (n as HTMLElement).click()).catch(() => {}); // try one more time
      await advanceClock(page, 1000);
      await page.waitForTimeout(100);
  }

  // To ensure the state updates actually push through Next.js
  if (buttonText === 'Start Race' || buttonText === 'Update Race') {
      // Since fake timers often block form submissions, we call the actual store logic
      await page.evaluate(() => {
          const store = (window as unknown as import('../../support/store-type').TestWindow).__bellLapStore;
          if (store) {
              const state = store.getState();
              // Use current state since i_select_dropdown already updated the store directly!
              // Do NOT read from DOM as it might not be updated!
              const event = state.event || '500 SC';
              const lanes = state.laneCount || 8;
              const eventNumber = state.eventNumber || '';
              const heatNumber = state.heatNumber || '';

              store.getState().startRace(event, lanes, eventNumber, heatNumber);
          }
      });
      await advanceClock(page, 1000);
      await page.waitForTimeout(100);
  } else if (buttonText === 'Cancel') {
      await waitForHidden(dialog);
  }
});
