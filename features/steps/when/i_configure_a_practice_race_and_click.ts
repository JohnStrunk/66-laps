import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock, waitForVisible } from '../../support/utils';

When('I configure a practice race and click {string}', async function (this: CustomWorld, buttonName: string) {
    const button = this.page!.locator(`[data-testid="${buttonName.toLowerCase().replace(/ /g, '-')}-button"]`);
    await waitForVisible(button);
    await advanceClock(this.page!, 200);
    await button.click({ force: true });

    // Wait for the simulation to start
    const container = this.page!.locator('[data-testid="swim-container"]');

    let visible = false;
    for (let i = 0; i < 20; i++) {
        await advanceClock(this.page!, 100);
        if (await container.isVisible()) {
            visible = true;
            break;
        }
    }

    if (!visible) {
        // Force submit via evaluate as a fallback
        await this.page!.evaluate(() => {
            document.querySelector('form')?.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
        });

        for (let i = 0; i < 20; i++) {
            await advanceClock(this.page!, 100);
            if (await container.isVisible()) {
                visible = true;
                break;
            }
        }
    }

    if (!visible) {
        throw new Error('Simulation did not start after clicking Start and forcing submit');
    }
});
