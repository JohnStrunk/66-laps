import { CustomWorld } from '../../support/world';
import { Then } from '@cucumber/cucumber';
import { waitForVisible } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the camera should be tilted downward toward the base of the pool wall', async function (this: CustomWorld) {
    const readyDiv = this.page!.locator('[data-test-ready="true"]').first();
    await waitForVisible(readyDiv);
    await expect(readyDiv).toBeVisible();

    const data = await readyDiv.evaluate((el: HTMLElement) => JSON.parse(el.getAttribute('data-test-data')!));
    const rotationX = data.camera.rotation.x;
    expect(rotationX !== undefined && rotationX < 0, `Camera rotation.x was ${rotationX}, expected < 0`).toBeTruthy();
});
