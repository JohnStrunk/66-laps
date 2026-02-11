import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { selectDropdownItem } from '../../support/utils';

When('I select {string} from the Lane Dropdown', async function (this: CustomWorld, laneOption: string) {
  await selectDropdownItem(this.page!, 'lane-count-dropdown-trigger', laneOption);
});
