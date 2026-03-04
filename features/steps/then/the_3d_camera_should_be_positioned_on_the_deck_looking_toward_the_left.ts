import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible, waitForCondition } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the 3D camera should be positioned on the deck, looking toward the left', async function (this: CustomWorld) {
    const readyDiv = this.page!.locator('[data-test-ready="true"]').first();
    await waitForVisible(readyDiv);
    await expect(readyDiv).toBeVisible();

    await waitForCondition(this.page!, async () => {
        return await readyDiv.evaluate((el) => el.hasAttribute('data-test-data'));
    }, 10000);

    const data = await readyDiv.evaluate((el) => JSON.parse(el.getAttribute('data-test-data')!));
    const camPos = data.camera.position;

    expect(camPos.x === 3.0, `Camera X was ${camPos.x}, expected 3.0`).toBeTruthy();
});
