import { Then, DataTable } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible, advanceClock } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the Event Selection dropdown should have exactly these options:', async function (this: CustomWorld, dataTable: DataTable) {
    const expectedOptions = dataTable.raw().map((row: string[]) => row[0]);
    const trigger = this.page!.locator('[data-testid="event-selection-dropdown"]');
    await waitForVisible(trigger);
    await trigger.click({ force: true });

    await advanceClock(this.page!, 500);

    const popoverSelector = '[role="listbox"], [role="menu"], .heroui-popover, [data-slot="content"]';
    const itemSelector = 'button, li, [role="option"], [role="menuitem"], .heroui-listbox-item';

    const popoverLocator = this.page!.locator(popoverSelector).filter({ visible: true }).first();
    const itemLocator = popoverLocator.locator(itemSelector);

    const actualOptions = await itemLocator.allTextContents();

    // Close dropdown
    await this.page!.keyboard.press('Escape');
    await advanceClock(this.page!, 500);

    expect(actualOptions.map(o => o.trim())).toEqual(expectedOptions);
});
