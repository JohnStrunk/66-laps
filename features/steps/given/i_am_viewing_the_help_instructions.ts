import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

Given('I am viewing the help instructions', async function (this: CustomWorld) {
  // Navigate to main menu and tap help, or set view directly
  await this.page!.evaluate(() => {
    window.__bellLapStore.getState().setView('help');
  });
});
