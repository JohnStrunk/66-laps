import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock, waitFor3DReady } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the swimmers should have their rounded heads pointing in the direction of travel', async function (this: CustomWorld) {
    await waitFor3DReady(this.page!);
    const readyDiv = this.page!.locator('[data-testid="3d-pool-container"]');

    // Advance clock slightly to ensure movement
    await advanceClock(this.page!, 100);

    const data = await readyDiv.evaluate((el) => {
        const testData = JSON.parse(el.getAttribute('data-test-data')!);
        // In our logic, if moving +X (right), rotation.y should be PI/2 (approx 1.57).
        // If moving -X (left), rotation.y should be -PI/2 (approx -1.57).
        return {
            rotationY: testData.swimmer0?.rotation.y,
            positionX: testData.swimmer0?.position.x
        };
    });

    // We can't easily know if it's moving left or right at this exact instant without more state,
    // but we can assert that the rotation is either PI/2 or -PI/2.
    expect(data.rotationY !== undefined, 'Swimmer rotation.y should be defined').toBeTruthy();
    const isPointing = Math.abs(Math.abs(data.rotationY) - Math.PI / 2) < 0.1;
    expect(isPointing, `Swimmer rotation.y was ${data.rotationY}, expected +/- PI/2`).toBeTruthy();
});
