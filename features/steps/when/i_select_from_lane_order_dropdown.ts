import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { selectDropdownItem } from '../../support/utils';
import { TestWindow } from '../../support/store-type';

When('I select {string} from the Lane Order Dropdown', async function (this: CustomWorld, orderOption: string) {
  // Get current lane count from store
  const laneCount = await this.page!.evaluate(() => {
    return (window as unknown as TestWindow).__bellLapStore.getState().laneCount;
  });

  let targetText = orderOption;
  if (orderOption === 'Top to bottom') targetText = `1 - ${laneCount}`;
  if (orderOption === 'Bottom to top') targetText = `${laneCount} - 1`;

  await selectDropdownItem(this.page!, 'lane-order-dropdown-trigger', targetText);
});
