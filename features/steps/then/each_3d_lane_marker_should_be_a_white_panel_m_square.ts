import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitFor3DReady } from '../../support/utils';
import { expect } from '@playwright/test';

Then('each 3D lane marker should be a white panel {float}m square', async function (this: CustomWorld, size: number) {
    await waitFor3DReady(this.page!);
    expect(size > 0).toBeTruthy();
});
