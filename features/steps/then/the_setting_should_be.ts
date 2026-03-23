import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the {string} setting should be {string}', async function (this: CustomWorld, settingName: string, expectedValue: string) {
    const isTestMode = this.page!.url().includes('testMode=true');
    const triggerTestId = `settings-${settingName}`;

    if (isTestMode && settingName === 'Race Length') {
        const select = this.page!.locator(`select[data-testid="${triggerTestId}"]`);
        await waitForVisible(select);
        // For native select, we check the selected option's label or value
        // Our select uses the label as text content of options
        const value = await select.evaluate((el: HTMLSelectElement) => {
            const opt = el.options[el.selectedIndex];
            return opt ? opt.text : '';
        });
        expect(value.trim()).toBe(expectedValue);
    } else {
        // HeroUI Select usually renders as a button trigger
        const trigger = this.page!.locator(`[data-testid="${triggerTestId}"]`).locator('button').first();
        await waitForVisible(trigger);
        await expect(trigger).toContainText(expectedValue);
    }
});
