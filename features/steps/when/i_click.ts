import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock, waitForVisible } from '../../support/utils';

When('I click {string}', async function (this: CustomWorld, buttonName: string) {
    const button = this.page!.getByRole('button', { name: buttonName, exact: true });
    await waitForVisible(button);

    await button.click({ force: true });

    // Check if we are clicking Start, which should hide the form
    if (buttonName === 'Start') {
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
            // Force submit via evaluate as a fallback
            await this.page!.evaluate(() => {
                document.querySelector('form')?.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
            });

            for (let i = 0; i < 20; i++) {
                await advanceClock(this.page!, 100);
                if (!(await form.isVisible())) {
                    hidden = true;
                    break;
                }
            }
        }

        if (!hidden) {
            throw new Error('Form did not hide after clicking Start and forcing submit');
        }
    } else {
        for (let i = 0; i < 5; i++) {
            await advanceClock(this.page!, 200);
            await this.page!.waitForTimeout(20);
        }
    }
});
