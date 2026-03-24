import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock, waitForVisible } from '../../support/utils';

When('I click the {string} button', async function (this: CustomWorld, buttonName: string) {
    const button = this.page!.getByRole('button', { name: buttonName, exact: true });
    await waitForVisible(button);
    await advanceClock(this.page!, 200);
    await button.click({ force: true });

    // Allow some time for state changes
    for (let i = 0; i < 5; i++) {
        await advanceClock(this.page!, 200);
    }
});
