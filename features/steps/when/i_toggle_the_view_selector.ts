import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';

When('I toggle the view selector to {string}', async function (this: CustomWorld, viewMode: string) {
    const button = this.page!.getByRole('button', { name: viewMode, exact: true });
    await waitForVisible(button);
    await button.click();
});

When('the view selector is set to {string}', async function (this: CustomWorld, viewMode: string) {
    const button = this.page!.getByRole('button', { name: viewMode, exact: true });
    await waitForVisible(button);
    await button.click();
});
