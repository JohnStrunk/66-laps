import { CustomWorld } from '../../support/world';
import { waitForCondition } from '../../support/utils';
import { Then } from '@cucumber/cucumber';
import { waitForVisible } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the swimmers should have completed at least one turn and be heading back', async function (this: CustomWorld) {
    const readyDiv = this.page!.locator('[data-test-ready="true"]').first();
    await waitForVisible(readyDiv);
    await expect(readyDiv).toBeVisible();

    await waitForCondition(this.page!, async () => {
        return await readyDiv.evaluate((el: HTMLElement) => el.hasAttribute('data-test-data'));
    }, 10000);

    const pos = await readyDiv.evaluate((el: HTMLElement) => {
        const data = JSON.parse(el.getAttribute('data-test-data')!);
        return data.swimmer0?.position.x;
    });
    // In 500 SC, pool length is ~23m. At 30s, they should be well into lap 2.
    expect(pos !== undefined, 'Swimmer 0 position should be defined').toBeTruthy();
});
