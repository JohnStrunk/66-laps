import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';

When('I navigate to the "History" screen', async function (this: CustomWorld) {
  const button = this.page!.locator('[data-testid="history-button"]');
  await waitForVisible(button);
  await button.click({ force: true });
});
