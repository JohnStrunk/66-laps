import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';
import { advanceClock } from '../../support/utils';

Then('I should see exactly these options: {string}', async function (this: CustomWorld, optionsString: string) {
    const page = this.page!;
    const expectedOptions = optionsString.split(',').map(s => s.trim());

    // Wait for popover to be visible
    const popoverSelector = '[role="listbox"], [role="menu"], .heroui-popover, [data-slot="content"]';
    const popover = page.locator(popoverSelector).filter({ visible: true });

    await expect(popover.first()).toBeVisible();

    // Get all options
    const items = popover.first().locator('button, li, [role="option"], [role="menuitem"], .heroui-listbox-item');

    // Standard Playwright assertions might be slow here if there's animation, but waitForVisible handled the trigger.
    // Let's give it a few ticks.
    await advanceClock(page, 500);

    const actualOptions = await items.allTextContents();
    const cleanedActual = actualOptions.map(s => s.trim()).filter(s => s !== '');

    expect(cleanedActual).toEqual(expectedOptions);
});
