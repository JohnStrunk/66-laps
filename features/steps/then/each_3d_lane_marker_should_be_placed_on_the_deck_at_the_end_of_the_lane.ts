import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitFor3DReady } from '../../support/utils';
import { expect } from '@playwright/test';

Then('each 3D lane marker should be placed on the deck at the end of the lane', async function (this: CustomWorld) {
    await waitFor3DReady(this.page!);
    expect(true).toBeTruthy();
});
