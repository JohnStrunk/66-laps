import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { selectDropdownItem } from '../../support/utils';

When('I select {string} from the Event Selection dropdown', async function (this: CustomWorld, option: string) {
  await this.page!.waitForTimeout(500);
  await selectDropdownItem(this.page!, 'event-selection-dropdown', option);
});

When('I select {string} from the Lanes dropdown', async function (this: CustomWorld, option: string) {
  await this.page!.waitForTimeout(500);
  await selectDropdownItem(this.page!, 'lanes-dropdown', option);
});
