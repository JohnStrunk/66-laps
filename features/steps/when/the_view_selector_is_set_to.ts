import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';

import { advanceClock } from '../../support/utils';

When('the view selector is set to {string}', async function (this: CustomWorld, viewMode: string) {
    const button = this.page!.getByRole('button', { name: viewMode, exact: true });
    await waitForVisible(button);

    // Close any floating popovers from dropdowns that might overlap this button
    await this.page!.evaluate(() => document.body.click()).catch(()=>{});
    await this.page!.keyboard.press('Escape').catch(()=>{});
    await advanceClock(this.page!, 200);

    await button.click({ force: true });
});
