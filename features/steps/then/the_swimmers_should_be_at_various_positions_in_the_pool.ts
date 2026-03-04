import { CustomWorld } from '../../support/world';
import { waitForCondition } from '../../support/utils';
import { Then } from '@cucumber/cucumber';
import { waitForVisible } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the swimmers should be at various positions in the pool', async function (this: CustomWorld) {
    const readyDiv = this.page!.locator('[data-test-ready="true"]').first();
    await waitForVisible(readyDiv);
    await expect(readyDiv).toBeVisible();

    await waitForCondition(this.page!, async () => {
        return await readyDiv.evaluate((el: HTMLElement) => el.hasAttribute('data-test-data'));
    }, 10000);

    // Check swimmer 0 position
    const pos = await readyDiv.evaluate((el: HTMLElement) => {
        const data = JSON.parse(el.getAttribute('data-test-data')!);
        return data.swimmer0?.position.x;
    });
    expect(pos !== undefined && pos >= 0, `Swimmer 0 position X was ${pos}`).toBeTruthy();
});
