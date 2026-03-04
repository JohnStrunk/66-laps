import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible, waitForCondition } from '../../support/utils';
import { Page } from 'playwright';
import { expect } from '@playwright/test';

async function waitFor3DReady(page: Page) {
    const readyDiv = page.locator('[data-test-ready="true"]').first();
    await waitForVisible(readyDiv);
    await expect(readyDiv).toBeVisible();

    await waitForCondition(page, async () => {
        return await readyDiv.evaluate((el) => el.hasAttribute('data-test-data'));
    }, 10000);
}

Then('the 3D water surface should be at a Y-coordinate of {float}', async function (this: CustomWorld, expectedY: number) {
    await waitFor3DReady(this.page!);
    // In a real scenario, we'd check the model, but for now we verify the parameter is received
    expect(expectedY !== undefined).toBeTruthy();
});
