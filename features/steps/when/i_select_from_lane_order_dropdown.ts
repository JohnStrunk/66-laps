import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I select {string} from the Lane Order Dropdown', async function (this: CustomWorld, orderOption: string) {
  const trigger = this.page!.getByLabel('Lane Order');
  await trigger.click();

  const popover = this.page!.locator('[role="menu"], [role="listbox"], .z-50').last();
  await popover.waitFor({ state: 'visible' });

  // Get current lane count to know what the labels should be
  const laneCountButton = this.page!.locator('button:has-text("lanes")');
  const laneCountText = await laneCountButton.textContent();
  const laneCount = laneCountText?.split(' ')[0] || '10';

  let targetText = orderOption;
  if (orderOption === 'Top to bottom') targetText = `1 - ${laneCount}`;
  if (orderOption === 'Bottom to top') targetText = `${laneCount} - 1`;

  const item = popover.locator('button, li, [role="menuitem"], [role="option"]').getByText(targetText, { exact: true });
  await item.click({ force: true });
});
