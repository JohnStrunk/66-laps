import { CustomWorld } from '../../support/world';
import { Then } from '@cucumber/cucumber';
import { waitFor3DReady } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the camera height should be fixed at {float} meters', async function (this: CustomWorld, float: number) {
    await waitFor3DReady(this.page!);
    const readyDiv = this.page!.locator('[data-testid="3d-pool-container"]');

    const data = await readyDiv.evaluate((el: HTMLElement) => JSON.parse(el.getAttribute('data-test-data')!));
    const camPos = data.camera.position;
    expect(camPos.y !== undefined && Math.abs(camPos.y - float) < 0.01, `Camera Y was ${camPos.y}, expected ${float}`).toBeTruthy();
});
