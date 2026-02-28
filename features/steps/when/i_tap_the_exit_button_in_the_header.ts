import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock } from '../../support/utils';

When('I tap the "Exit" button in the header', async function (this: CustomWorld) {
  // Try both history exit and race exit buttons
  const historyExit = this.page!.locator('[data-testid="exit-history-button"]');
  const raceExit = this.page!.locator('[data-testid="exit-button"]');

  if (await historyExit.isVisible()) {
    await historyExit.click();
  } else if (await raceExit.isVisible()) {
    await raceExit.click();
  } else {
    throw new Error('No exit button found in header');
  }

  await advanceClock(this.page!, 500);
});
