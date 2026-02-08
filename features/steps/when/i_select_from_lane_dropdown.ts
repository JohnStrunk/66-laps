import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I select {string} from the Lane Dropdown', async function (this: CustomWorld, laneOption: string) {
  await this.page!.click(`button:has-text("lanes")`);
  const popover = this.page!.locator('[role="menu"], [role="listbox"], .z-50').last();
  await popover.waitFor({ state: 'visible' });
  const item = popover.locator('button, li, [role="menuitem"], [role="option"]').getByText(laneOption, { exact: true });
  await item.click({ force: true });
});
