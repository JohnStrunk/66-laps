import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock, waitForVisible } from '../../support/utils';

When('I click on the first race record', async function (this: CustomWorld) {
  const locator = this.page!.locator('[data-testid="history-record"]').first();
  await waitForVisible(locator);
  await locator.evaluate(el => (el as HTMLElement).click());
  await advanceClock(this.page!, 500);
});
