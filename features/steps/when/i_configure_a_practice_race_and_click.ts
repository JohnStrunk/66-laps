import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible, advanceClock } from '../../support/utils';

When('I configure a practice race and click {string}', async function (this: CustomWorld, buttonName: string) {
    const button = this.page!.getByRole('button', { name: buttonName, exact: true });
    await waitForVisible(button);
    await button.dispatchEvent('click');

    // Wait for the form to hide to ensure submit worked
    const form = this.page!.locator('form');
    let hidden = false;
    for (let i = 0; i < 20; i++) {
        await advanceClock(this.page!, 100);
        if (!(await form.isVisible())) {
            hidden = true;
            break;
        }
    }
    if (!hidden) {
        throw new Error('Form did not hide after clicking Start');
    }
});
