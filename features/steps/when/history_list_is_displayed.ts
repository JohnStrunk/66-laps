import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('the history list is displayed', async function (this: CustomWorld) {
  // Wait for at least one history record to appear.
  await this.page!.waitForSelector('[data-testid="history-record"]', { timeout: 5000 });
});
