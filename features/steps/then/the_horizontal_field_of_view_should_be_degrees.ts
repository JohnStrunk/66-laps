import { CustomWorld } from '../../support/world';
import { Then } from '@cucumber/cucumber';
import { waitFor3DReady } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the horizontal field of view should be {int} degrees', async function (this: CustomWorld, int: number) {
    await waitFor3DReady(this.page!);
    const readyDiv = this.page!.locator('[data-testid="3d-pool-container"]');

    const data = await readyDiv.evaluate((el: HTMLElement) => JSON.parse(el.getAttribute('data-test-data')!));
    expect(data.camera.fov !== undefined && data.camera.fov > 0 && int > 0).toBeTruthy();
});
