import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { selectDropdownItem } from '../../support/utils';

When('I set the {string} setting to {string}', async function (this: CustomWorld, settingName: string, value: string) {
    const triggerTestId = `settings-${settingName}`;
    await selectDropdownItem(this.page!, triggerTestId, value);
});
