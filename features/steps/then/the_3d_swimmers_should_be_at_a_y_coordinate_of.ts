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

Then('the 3D swimmers should be at a Y-coordinate of {float}', async function (this: CustomWorld, expectedY: number) {
    await waitFor3DReady(this.page!);
    const readyDiv = this.page!.locator('[data-test-ready="true"]').first();
    const data = await readyDiv.evaluate((el) => JSON.parse(el.getAttribute('data-test-data')!));
    expect(data.swimmer0.position.y).toBe(expectedY);
});
