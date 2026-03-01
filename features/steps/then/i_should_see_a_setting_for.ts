import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';

Then('I should see a setting for {string} with options {string} and {string}', async function (this: CustomWorld, settingName: string, option1: string, option2: string) {
    const settingLabel = this.page!.locator(`label:has-text("${settingName}")`);
    await waitForVisible(settingLabel);
    // Click to open the listbox
    await this.page!.getByRole('button', { name: settingName }).click();

    const listbox = this.page!.getByRole('listbox', { name: settingName });
    await waitForVisible(listbox.getByRole('option', { name: option1 }));
    await waitForVisible(listbox.getByRole('option', { name: option2 }));

    // Close it
    await this.page!.mouse.click(0,0);
});
