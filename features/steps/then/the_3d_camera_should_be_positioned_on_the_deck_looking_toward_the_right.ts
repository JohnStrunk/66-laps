import { CustomWorld } from '../../support/world';
import { Then } from '@cucumber/cucumber';
import { waitFor3DReady } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the 3D camera should be positioned on the deck, looking toward the right', async function (this: CustomWorld) {
    await waitFor3DReady(this.page!);
    const readyDiv = this.page!.locator('[data-testid="3d-pool-container"]');

    const data = await readyDiv.evaluate((el: HTMLElement) => JSON.parse(el.getAttribute('data-test-data')!));
    const camPos = data.camera.position;
    expect(camPos.x !== undefined && camPos.x > 3.0, `Camera X was ${camPos.x}, expected > 3.0 for right orientation`).toBeTruthy();
});
