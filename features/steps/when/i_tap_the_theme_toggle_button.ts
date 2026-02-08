import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I tap the theme toggle button', async function (this: CustomWorld) {
  const button = this.page!.locator('[data-testid="theme-toggle"]');
  await button.click();
});
