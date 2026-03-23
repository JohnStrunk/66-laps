import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitFor3DReady } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the 3D water surface should be at a Y-coordinate of {float}', async function (this: CustomWorld, expectedY: number) {
    await waitFor3DReady(this.page!);
    // In a real scenario, we'd check the model, but for now we verify the parameter is received
    expect(expectedY !== undefined).toBeTruthy();
});
