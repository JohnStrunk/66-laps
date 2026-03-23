import { CustomWorld } from '../../support/world';
import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Then('the 3D swimmers should start at the start end', async function (this: CustomWorld) {
    const container = this.page!.locator('[data-test-ready="true"]').first();
    await container.waitFor({ state: 'visible' });
    const data = await container.evaluate((el) => JSON.parse(el.getAttribute('data-test-data')!));

    // Swimmer 0 position should be at start wall (location 0)
    // and moving toward the turn end (Direction.TOTURN = 1)
    const swimmer0 = data.swimmers[0];
    expect(swimmer0.location).toBeLessThan(0.1);
    expect(swimmer0.direction).toBe(1); // Direction.TOTURN
});
