import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';

When('I click the {string} settings dropdown', async function (this: CustomWorld, settingName: string) {
    const triggerTestId = `settings-${settingName}`;
    const trigger = this.page!.locator(`[data-testid="${triggerTestId}"]`);
    await waitForVisible(trigger);
    await trigger.click({ force: true });
});
