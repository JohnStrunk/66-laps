import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { selectDropdownItem } from '../../support/utils';

When('I select {string} from the Lane Order Dropdown', async function (this: CustomWorld, orderOption: string) {
  // Get current lane count to know what the labels should be
  const laneCountButton = this.page!.locator('[data-testid="lane-count-dropdown-trigger"]');
  const laneCountText = await laneCountButton.textContent();
  const laneCount = laneCountText?.trim().split(' ')[0] || '10';

  let targetText = orderOption;
  if (orderOption === 'Top to bottom') targetText = `1 - ${laneCount}`;
  if (orderOption === 'Bottom to top') targetText = `${laneCount} - 1`;

  await selectDropdownItem(this.page!, 'lane-order-dropdown-trigger', targetText);
});
