import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I click {string} on the Practice view', async function (this: CustomWorld, buttonName: string) {
    const button = this.page!.getByRole('button', { name: buttonName, exact: true });
    await button.click();
});
