import { CustomWorld } from '../../support/world';
import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Then('the 3D swimmers should start at the turn end', async function (this: CustomWorld) {
    const container = this.page!.locator('[data-test-ready="true"]').first();
    await container.waitFor({ state: 'visible' });
    const data = await container.evaluate((el) => JSON.parse(el.getAttribute('data-test-data')!));

    // Swimmer 0 position should be at turn wall (location 1)
    // and moving toward the start end (Direction.TOSTART = 0)
    const swimmer0 = data.swimmers[0];
    expect(swimmer0.location).toBeGreaterThan(0.9);
    expect(swimmer0.direction).toBe(0); // Direction.TOSTART
});
