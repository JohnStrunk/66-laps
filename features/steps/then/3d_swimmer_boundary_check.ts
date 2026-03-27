import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock } from '../../support/utils';
import { TestWindow } from '../../../src/modules/testTypes';
import { expect } from '@playwright/test';

Then('the 3D swimmer in lane 0 should be within the pool boundaries at start and turn ends', { timeout: 120000 }, async function (this: CustomWorld) {
    const page = this.page!;

    const lapTimesMs = await page.evaluate(() => {
        const testWin = window as unknown as TestWindow;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const model = testWin.__TEST_SWIMMER_0_MODEL__ as any;
        if (!model) return [];
        const times: number[] = [];
        let cumTime = model.startTime || 0;
        for (let i = 0; i < model.lapTimes.length; i++) {
            cumTime += model.lapTimes[i] * 1000;
            times.push(cumTime);
        }
        return times;
    });

    if (lapTimesMs.length < 2) {
        throw new Error("Not enough lap times available to check both start and turn ends");
    }

    // Check points a bit before the end of the laps
    const points = [
        { time: lapTimesMs[0] - 50, expectedAtTurn: true, expectedAtStart: false },
        { time: lapTimesMs[0] + 50, expectedAtTurn: true, expectedAtStart: false },
        { time: lapTimesMs[1] - 50, expectedAtTurn: false, expectedAtStart: true },
        { time: lapTimesMs[1] + 50, expectedAtTurn: false, expectedAtStart: true },
    ];

    for (const point of points) {
        const currentSimTime = await page.evaluate(() => Date.now());

        if (point.time > currentSimTime) {
            await advanceClock(page, point.time - currentSimTime);
            await page.waitForTimeout(20);
        }

        const data = await page.evaluate(() => {
            const testWin = window as unknown as TestWindow;
            const swimmer = testWin.__TEST_SWIMMER_0__;
            const model = testWin.__TEST_SWIMMER_0_MODEL__;
            const poolLength = testWin.__TEST_POOL_LENGTH__;

            if (!swimmer || !model || !poolLength) return null;
            const { location } = model.where();
            const xPos = swimmer.position.x;
            const minX = xPos - 0.75;
            const maxX = xPos + 0.75;

            return { location, xPos, minX, maxX, poolLength, isAtTurn: location > 0.95, isAtStart: location < 0.05 };
        });

        if (data) {
            expect(data.minX >= -0.01, `[Time: ${point.time}] Swimmer went past start wall! minX=${data.minX}, xPos=${data.xPos}, location=${data.location}`).toBeTruthy();
            expect(data.maxX <= data.poolLength + 0.01, `[Time: ${point.time}] Swimmer went past turn wall! maxX=${data.maxX}, poolLength=${data.poolLength}, xPos=${data.xPos}, location=${data.location}`).toBeTruthy();
        }
    }
});
