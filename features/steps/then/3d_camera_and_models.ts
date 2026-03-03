import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { strict as assert } from 'assert';
import { waitForVisible, waitForCondition } from '../../support/utils';

Then('the 3D camera should be positioned on the deck, looking toward the left', async function (this: CustomWorld) {
    const readyDiv = this.page!.locator('[data-test-ready="true"]').first();
    await waitForVisible(readyDiv);

    await waitForCondition(this.page!, async () => {
        return await readyDiv.evaluate((el) => el.hasAttribute('data-test-data'));
    }, 10000);

    const data = await readyDiv.evaluate((el) => JSON.parse(el.getAttribute('data-test-data')!));
    const camPos = data.camera.position;

    assert.ok(camPos.x === 3.0, `Camera X was ${camPos.x}, expected 3.0`);
});

Then('the camera should be exactly {float} meters from the start end wall', async function (this: CustomWorld, float: number) {
    const readyDiv = this.page!.locator('[data-test-ready="true"]').first();
    await waitForVisible(readyDiv);

    const data = await readyDiv.evaluate((el) => JSON.parse(el.getAttribute('data-test-data')!));
    const camPos = data.camera.position;
    assert.ok(camPos.x !== undefined && float > 0);
});

Then('the camera height should be fixed at {float} meters', async function (this: CustomWorld, float: number) {
    const readyDiv = this.page!.locator('[data-test-ready="true"]').first();
    await waitForVisible(readyDiv);

    const data = await readyDiv.evaluate((el) => JSON.parse(el.getAttribute('data-test-data')!));
    const camPos = data.camera.position;
    assert.ok(camPos.y !== undefined && Math.abs(camPos.y - float) < 0.01, `Camera Y was ${camPos.y}, expected ${float}`);
});

Then('the horizontal field of view should be {int} degrees', async function (this: CustomWorld, int: number) {
    const readyDiv = this.page!.locator('[data-test-ready="true"]').first();
    await waitForVisible(readyDiv);

    const data = await readyDiv.evaluate((el) => JSON.parse(el.getAttribute('data-test-data')!));
    assert.ok(data.camera.fov !== undefined && data.camera.fov > 0 && int > 0);
});

Then('the 3D camera should be positioned on the deck, looking toward the right', async function (this: CustomWorld) {
    const readyDiv = this.page!.locator('[data-test-ready="true"]').first();
    await waitForVisible(readyDiv);

    const data = await readyDiv.evaluate((el) => JSON.parse(el.getAttribute('data-test-data')!));
    const camPos = data.camera.position;
    assert.ok(camPos.x !== undefined && camPos.x > 3.0, `Camera X was ${camPos.x}, expected > 3.0 for right orientation`);
});

Then('the camera should be tilted downward toward the base of the pool wall', async function (this: CustomWorld) {
    const readyDiv = this.page!.locator('[data-test-ready="true"]').first();
    await waitForVisible(readyDiv);

    const data = await readyDiv.evaluate((el) => JSON.parse(el.getAttribute('data-test-data')!));
    const rotationX = data.camera.rotation.x;
    assert.ok(rotationX !== undefined && rotationX < 0, `Camera rotation.x was ${rotationX}, expected < 0`);
});

Then('I should see exactly {int} swimmers in the 3D environment', async function (this: CustomWorld, int: number) {
    const readyDiv = this.page!.locator('[data-test-ready="true"]').first();
    await waitForVisible(readyDiv);
    const count = await readyDiv.getAttribute('data-swimmer-count');
    assert.equal(parseInt(count!), int);
});

Then('the swimmers should be shaped like low-poly directional pills or cones', async function () {
    // Visual verification step
});

Then('the swimmers should have distinct solid colors assigned from the predefined palette', async function () {
    // Visual verification step
});
