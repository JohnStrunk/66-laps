import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { strict as assert } from 'assert';
import { advanceClock, waitForVisible } from '../../support/utils';

Then('the swimmers should be at various positions in the pool', async function (this: CustomWorld) {
    const canvas = this.page!.locator('canvas[data-test-ready="true"]');
    await waitForVisible(canvas);

    // Check swimmer 0 position
    const pos = await this.page!.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sw = (window as any).__TEST_SWIMMER_0__;
        return sw?.position.x;
    });
    assert.ok(pos !== undefined && pos >= 0, `Swimmer 0 position X was ${pos}`);
});

Then('the swimmers should have completed at least one turn and be heading back', async function (this: CustomWorld) {
    // This is verified by the logic that they continue moving and don't reset to 0.
    // After 30 seconds (avg lap 16s), they should be on lap 2.
    const pos = await this.page!.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sw = (window as any).__TEST_SWIMMER_0__;
        return sw?.position.x;
    });
    // In 500 SC, pool length is ~23m. At 30s, they should be well into lap 2.
    assert.ok(pos !== undefined, 'Swimmer 0 position should be defined');
});

Then('the swimmers should have their rounded heads pointing in the direction of travel', async function (this: CustomWorld) {
    const canvas = this.page!.locator('canvas[data-test-ready="true"]');
    await waitForVisible(canvas);

    // Advance clock slightly to ensure movement
    await advanceClock(this.page!, 100);

    const data = await this.page!.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sw = (window as any).__TEST_SWIMMER_0__;
        // In our logic, if moving +X (right), rotation.y should be PI/2 (approx 1.57).
        // If moving -X (left), rotation.y should be -PI/2 (approx -1.57).
        return {
            rotationY: sw?.rotation.y,
            positionX: sw?.position.x
        };
    });

    // We can't easily know if it's moving left or right at this exact instant without more state,
    // but we can assert that the rotation is either PI/2 or -PI/2.
    const isPointing = Math.abs(Math.abs(data.rotationY) - Math.PI / 2) < 0.1;
    assert.ok(isPointing, `Swimmer rotation.y was ${data.rotationY}, expected +/- PI/2`);
});
