import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { strict as assert } from 'assert';
import { waitForVisible } from '../../support/utils';

Then('the {string} setting should be reset to {string}', async function (this: CustomWorld, settingName: string, expectedValue: string) {
    const trigger = this.page!.locator(`div[data-slot="base"]:has(label:text-is("${settingName}"))`).locator('button');
    await waitForVisible(trigger);
    const text = await trigger.textContent();
    assert.ok(text?.includes(expectedValue), `Expected "${text}" to include "${expectedValue}"`);
});
