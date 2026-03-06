import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the default {string} should be {string}', async function (this: CustomWorld, settingName: string, expectedValue: string) {
    const trigger = this.page!.locator(`div[data-slot="base"]:has(label:text-is("${settingName}"))`).locator('button');
    await waitForVisible(trigger);
    await expect(trigger).toBeVisible();
    await expect(trigger).toContainText(expectedValue);
});
