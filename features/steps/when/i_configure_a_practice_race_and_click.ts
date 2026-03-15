import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';

When('I configure a practice race and click {string}', async function (this: CustomWorld, buttonName: string) {
    const button = this.page!.getByRole('button', { name: buttonName, exact: true });
    await waitForVisible(button);
    await button.click({ force: true });

    // Wait for the simulation to start
    const container = this.page!.locator('[data-testid="swim-container"]');
    await waitForVisible(container);
});
