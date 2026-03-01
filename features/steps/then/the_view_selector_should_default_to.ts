import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';

Then('the view selector should default to {string}', async function (this: CustomWorld, expectedValue: string) {
    // Assuming the view selector is a toggle or select, check its current value.
    // For now we assume the active button or selected mode matches the expected string
    const activeState = this.page!.locator(`button:has-text("${expectedValue}")[data-active="true"]`);
    await waitForVisible(activeState);
});
