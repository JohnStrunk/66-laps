import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I navigate to the "History" screen', async function (this: CustomWorld) {
  await this.page!.click('[data-testid="history-button"]');
});
