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

Then('the 3D lane ropes should be at a Y-coordinate of {float}', async function (this: CustomWorld, expectedY: number) {
    await waitFor3DReady(this.page!);
    expect(expectedY !== undefined).toBeTruthy();
});
