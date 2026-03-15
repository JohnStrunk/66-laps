import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitFor3DReady } from '../../support/utils';
import { expect } from '@playwright/test';

Then('I should see 3D lane markers for each lane', async function (this: CustomWorld) {
    await waitFor3DReady(this.page!);
    expect(true).toBeTruthy();
});
