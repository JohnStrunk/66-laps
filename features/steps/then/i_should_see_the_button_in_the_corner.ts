import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';

Then('I should see the {string} button in the corner', async function (this: CustomWorld, buttonText: string) {
    const button = this.page!.getByRole('button', { name: buttonText });
    await waitForVisible(button);
});
