import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I select {string} from the Lane Order Dropdown', async function (this: CustomWorld, orderOption: string) {
  const trigger = this.page!.getByLabel('Lane Order');
  await trigger.click();

  const popover = this.page!.locator('[role="menu"], [role="listbox"], .z-50').last();
  await popover.waitFor({ state: 'visible' });

  const item = popover.locator('button, li, [role="menuitem"], [role="option"]').getByText(orderOption, { exact: true });
  await item.click({ force: true });
});
