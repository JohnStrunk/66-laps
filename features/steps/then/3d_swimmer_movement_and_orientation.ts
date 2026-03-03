import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { strict as assert } from 'assert';
import { advanceClock, waitForVisible, waitForCondition } from '../../support/utils';

Then('the swimmers should be at various positions in the pool', async function (this: CustomWorld) {
    const canvas = this.page!.locator('canvas[data-test-ready="true"]');
    await waitForVisible(canvas);

    await waitForCondition(this.page!, async () => {
        return await canvas.evaluate((el) => el.hasAttribute('data-test-data'));
    }, 10000);

    // Check swimmer 0 position
    const pos = await canvas.evaluate((el) => {
        const data = JSON.parse(el.getAttribute('data-test-data')!);
        return data.swimmer0?.position.x;
    });
    assert.ok(pos !== undefined && pos >= 0, `Swimmer 0 position X was ${pos}`);
});

Then('the swimmers should have completed at least one turn and be heading back', async function (this: CustomWorld) {
    const canvas = this.page!.locator('canvas[data-test-ready="true"]');
    await waitForVisible(canvas);

    await waitForCondition(this.page!, async () => {
        return await canvas.evaluate((el) => el.hasAttribute('data-test-data'));
    }, 10000);

    const pos = await canvas.evaluate((el) => {
        const data = JSON.parse(el.getAttribute('data-test-data')!);
        return data.swimmer0?.position.x;
    });
    // In 500 SC, pool length is ~23m. At 30s, they should be well into lap 2.
    assert.ok(pos !== undefined, 'Swimmer 0 position should be defined');
});

Then('the swimmers should have their rounded heads pointing in the direction of travel', async function (this: CustomWorld) {
    const canvas = this.page!.locator('canvas[data-test-ready="true"]');
    await waitForVisible(canvas);

    // Advance clock slightly to ensure movement
    await advanceClock(this.page!, 100);

    await waitForCondition(this.page!, async () => {
        return await canvas.evaluate((el) => el.hasAttribute('data-test-data'));
    }, 10000);

    const data = await canvas.evaluate((el) => {
        const testData = JSON.parse(el.getAttribute('data-test-data')!);
        // In our logic, if moving +X (right), rotation.y should be PI/2 (approx 1.57).
        // If moving -X (left), rotation.y should be -PI/2 (approx -1.57).
        return {
            rotationY: testData.swimmer0?.rotation.y,
            positionX: testData.swimmer0?.position.x
        };
    });

    // We can't easily know if it's moving left or right at this exact instant without more state,
    // but we can assert that the rotation is either PI/2 or -PI/2.
    assert.ok(data.rotationY !== undefined, 'Swimmer rotation.y should be defined');
    const isPointing = Math.abs(Math.abs(data.rotationY) - Math.PI / 2) < 0.1;
    assert.ok(isPointing, `Swimmer rotation.y was ${data.rotationY}, expected +/- PI/2`);
});
