import { CustomWorld } from '../../support/world';
import { Then } from '@cucumber/cucumber';
import { waitForVisible } from '../../support/utils';
import { expect } from '@playwright/test';

Then('I should see exactly {int} swimmers in the 3D environment', async function (this: CustomWorld, int: number) {
    const readyDiv = this.page!.locator('[data-test-ready="true"]').first();
    await waitForVisible(readyDiv);
    await expect(readyDiv).toBeVisible();
    const count = await readyDiv.getAttribute('data-swimmer-count');
    expect(parseInt(count!)).toBe(int);
});
