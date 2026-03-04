import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('no order of finish should be displayed', async function (this: CustomWorld) {
    const oof = this.page!.locator('[data-testid="order-of-finish"]');
    await expect(oof).not.toBeVisible();
});
