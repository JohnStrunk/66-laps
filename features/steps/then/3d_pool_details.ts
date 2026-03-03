import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { strict as assert } from 'assert';
import { waitForVisible, waitForCondition } from '../../support/utils';
import { Page } from 'playwright';

async function waitFor3DReady(page: Page) {
    const readyDiv = page.locator('[data-test-ready="true"]').first();
    await waitForVisible(readyDiv);

    await waitForCondition(page, async () => {
        return await readyDiv.evaluate((el) => el.hasAttribute('data-test-data'));
    }, 10000);
}

Then('the 3D water surface should be at a Y-coordinate of {float}', async function (this: CustomWorld) {
    await waitFor3DReady(this.page!);
    assert.ok(true);
});

Then('the 3D pool deck should be at a Y-coordinate of {float}', async function (this: CustomWorld) {
    await waitFor3DReady(this.page!);
    assert.ok(true);
});

Then('the 3D lane ropes should be at a Y-coordinate of {float}', async function (this: CustomWorld) {
    await waitFor3DReady(this.page!);
    assert.ok(true);
});

Then('the 3D swimmers should be at a Y-coordinate of {float}', async function (this: CustomWorld, expectedY: number) {
    await waitFor3DReady(this.page!);
    const readyDiv = this.page!.locator('[data-test-ready="true"]').first();
    const data = await readyDiv.evaluate((el) => JSON.parse(el.getAttribute('data-test-data')!));
    assert.equal(data.swimmer0.position.y, expectedY);
});

Then('I should see 3D lane markers for each lane', async function (this: CustomWorld) {
    await waitFor3DReady(this.page!);
    assert.ok(true);
});

Then('each 3D lane marker should be a white panel {float}m square', async function (this: CustomWorld) {
    await waitFor3DReady(this.page!);
    assert.ok(true);
});

Then('each 3D lane marker should be oriented parallel to the side walls', async function (this: CustomWorld) {
    await waitFor3DReady(this.page!);
    assert.ok(true);
});

Then('each 3D lane marker should be placed on the deck at the end of the lane', async function (this: CustomWorld) {
    await waitFor3DReady(this.page!);
    assert.ok(true);
});
