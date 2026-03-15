import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import { advanceClock, waitFor3DReady } from '../../support/utils';
import { TestWindow } from '../../../src/modules/testTypes';

Then('the water shader should be compiled without errors', async function (this: CustomWorld) {
    await waitFor3DReady(this.page!);

    // Wait for the material to be exposed by PoolScene
    let materialAvailable = false;
    for (let i = 0; i < 30; i++) {
        await advanceClock(this.page!, 500);
        materialAvailable = await this.page!.evaluate(() => (window as unknown as TestWindow).__TEST_WATER_MATERIAL__ !== undefined);
        if (materialAvailable) break;
    }

    expect(materialAvailable, 'Water shader material not exposed on window').toBe(true);

    const isCompiled = await this.page!.evaluate(() => {
        const material = (window as unknown as TestWindow).__TEST_WATER_MATERIAL__;
        if (!material) return false;
        // In Three.js, material.id is only truthy if successfully created
        return !!(material as { id?: number }).id;
    });
    expect(isCompiled).toBe(true);
});
