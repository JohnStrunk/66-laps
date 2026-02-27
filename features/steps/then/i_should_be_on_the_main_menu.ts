import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

Then('I should be on the main menu', async function (this: CustomWorld) {
  const mainMenu = await this.page!.locator('[data-testid="new-race-button"]');
  await mainMenu.waitFor({ state: 'visible' });
});
