import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';

Then('I should see the main menu', async function (this: CustomWorld) {
  const mainMenu = this.page!.locator('[data-testid="new-race-button"]');
  await waitForVisible(mainMenu);
  const historyButton = this.page!.locator('[data-testid="history-button"]');
  await waitForVisible(historyButton);
});
