import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock } from '../../support/utils';
import { TestWindow } from '../../../src/modules/testTypes';
import { expect } from '@playwright/test';

Then('the 3D swimmer in lane 0 should be within the pool boundaries at start and turn ends', { timeout: 120000 }, async function (this: CustomWorld) {
    const page = this.page!;

    let hitTurn = false;
    let hitStart = false;
    const testStartTime = Date.now();

    while (!hitTurn || !hitStart) {
        if (Date.now() - testStartTime > 115000) {
            throw new Error(`Timed out waiting for swimmer to hit both walls. hitTurn=${hitTurn}, hitStart=${hitStart}`);
        }

        const data = await page.evaluate(() => {
            const testWin = window as unknown as TestWindow;
            const swimmer = testWin.__TEST_SWIMMER_0__;
            const model = testWin.__TEST_SWIMMER_0_MODEL__;
            const poolLength = testWin.__TEST_POOL_LENGTH__;

            if (!swimmer || !model || !poolLength) return null;
            const { location } = model.where();
            const xPos = swimmer.position.x;

            // Now that meshes are centered, the world X range is always [xPos - 0.75, xPos + 0.75]
            // regardless of rotation (since rotation is only around Y).
            const minX = xPos - 0.75;
            const maxX = xPos + 0.75;

            return {
                location,
                xPos,
                minX,
                maxX,
                poolLength,
                isAtTurn: location > 0.95, // Relaxed slightly for faster clock
                isAtStart: location < 0.05
            };
        });

        if (data) {
            expect(data.minX >= -0.01, `Swimmer went past start wall! minX=${data.minX}, xPos=${data.xPos}, location=${data.location}`).toBeTruthy();
            expect(data.maxX <= data.poolLength + 0.01, `Swimmer went past turn wall! maxX=${data.maxX}, poolLength=${data.poolLength}, xPos=${data.xPos}, location=${data.location}`).toBeTruthy();

            if (data.isAtTurn) hitTurn = true;
            if (data.isAtStart) hitStart = true;
        }

        await advanceClock(page, 200); // 200ms steps
    }
});
