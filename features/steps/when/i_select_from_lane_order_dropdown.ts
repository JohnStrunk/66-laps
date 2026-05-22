import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I select {string} from the Lane Order Dropdown', async function (this: CustomWorld, orderOption: string) {
  const trigger = this.page!.locator('[data-testid="lane-order-dropdown-trigger"]');
  await trigger.click();

  const testId = orderOption === 'Bottom to top' ? 'lane-order-item-bottom' : 'lane-order-item-top';
  const item = this.page!.locator(`[data-testid="${testId}"]`);
  await item.click();
});
