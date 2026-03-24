import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('I should still be on the simulation screen', async function (this: CustomWorld) {
    const container = this.page!.getByTestId('swim-container');
    await expect(container).toBeVisible();
});
