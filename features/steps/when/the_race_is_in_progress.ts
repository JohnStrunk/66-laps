import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock } from '../../support/utils';

When('the race is in progress', async function (this: CustomWorld) {
    const page = this.page!;

    // Determine the view mode and lane count to decide on the order
    const container = page.locator('[data-swimmer-count]');
    await container.first().waitFor({ state: 'attached' });

    const numbering = await container.first().getAttribute('data-numbering');
    const totalLanesAttr = await container.first().getAttribute('data-swimmer-count');
    const totalLanes = parseInt(totalLanesAttr || '3');

    await page.evaluate(`(function(args) {
        var totalLanes = args.totalLanes;
        var numbering = args.numbering;
        var swimmers = window.__TEST_SWIMMERS__;
        if (!swimmers) return;

        var getIdx = function(lane) { return numbering === 'AWAY' ? totalLanes - lane : lane - 1; };

        var lane1Idx = getIdx(1);
        var lane2Idx = getIdx(2);
        var lane3Idx = getIdx(3);

        var is3D = !!window.__TEST_SCENE__ || !!document.querySelector('[data-testid="3d-pool-container"]');

        if (is3D) {
            // 3D Scenario: 3 finishes first, then 2, then 1
            swimmers[lane3Idx]._lapTimes = [5, 5];
            swimmers[lane2Idx]._lapTimes = [10, 10];
            swimmers[lane1Idx]._lapTimes = [15, 15];
        } else {
            // 2D Scenario: 2 finishes first, then 1, then 3
            swimmers[lane2Idx]._lapTimes = [5, 5];
            swimmers[lane1Idx]._lapTimes = [10, 10];
            swimmers[lane3Idx]._lapTimes = [15, 15];
        }

        var now = Date.now();
        swimmers.forEach(function(s) { s._startTimeMs = now - 1000; });
    })({ totalLanes: ${totalLanes}, numbering: '${numbering}' })`);

    await advanceClock(page, 1000);
});
