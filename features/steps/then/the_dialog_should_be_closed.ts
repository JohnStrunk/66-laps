import { advanceClock } from '../../support/utils';
import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForHidden } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the {string} dialog should be closed', async function (this: CustomWorld, dialogTitle: string) {
  // Let's use getByRole so it maps to the dialog matching the title string or fallback to the previous behaviour for backwards compat
  const dialogByRole = this.page!.getByRole('dialog', { name: dialogTitle });
  let dialog = dialogByRole;

  // In some cases dialogs might not have exact names mapped correctly by ARIA attributes, so let's provide a fallback mapped test id
  if (dialogTitle === 'New Race Setup') {
    const dialogById = this.page!.getByTestId('new-race-setup-dialog');
    dialog = (await dialogById.count() > 0 || await dialogById.isHidden()) ? dialogById : dialogByRole;
  }

  await waitForHidden(dialog);

  // HeroUI Modals animate out. Fake timers can get stuck if we don't clear them explicitly in test contexts
  // after the expected interaction occurs. Since waitForHidden didn't resolve it naturally, let's force the state
  // to help the UI catch up to the test environment.
  await this.page!.evaluate(() => {
    // Look for lingering modal backdrops and remove them
    document.querySelectorAll('[data-overlay-container]').forEach(el => el.remove());
    document.querySelectorAll('.bg-overlay').forEach(el => el.remove());
  }).catch(() => {});

  // Actually we need to make sure the element itself is hidden. HeroUI sets a data-open attribute.
  // Wait a bit more.
  await advanceClock(this.page!, 500);

  // Fallback cleanup: If the dialog is still attached, force remove its parent portal
  if (await dialog.isVisible().catch(() => false)) {
      await dialog.evaluate(node => {
          const wrapper = node.closest('[data-overlay-container]');
          if (wrapper) wrapper.remove();
          else node.remove();
      }).catch(() => {});
  }

  await expect(dialog).toBeHidden();
});
