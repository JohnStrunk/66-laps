import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { selectDropdownItem } from '../../support/utils';

Given('the {string} is set to {string}', async function (this: CustomWorld, settingName: string, value: string) {
    const triggerTestId = `settings-${settingName}`;
    await selectDropdownItem(this.page!, triggerTestId, value);
});
