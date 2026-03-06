import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';
import { AVATARS } from '../../../src/modules/SwimmerModel';

Then('the 2D swimmers should be assigned a consistent avatar emoji and color pair', async function (this: CustomWorld) {
    const swimmers = await this.page!.evaluate(() => {
        return (window as unknown as { __TEST_SWIMMERS__: import("../../../src/modules/SwimmerModel").ISwimmer[] }).__TEST_SWIMMERS__;
    });

    expect(swimmers).toBeDefined();
    expect(swimmers.length).toBeGreaterThan(0);

    // Check that each swimmer has a valid avatar from the AVATARS list
    for (const swimmer of swimmers) {
        const avatar = swimmer.avatar;
        expect(avatar).toBeDefined();

        const validAvatar = AVATARS.find(a => a.emoji === avatar.emoji && a.color === avatar.color);
        expect(validAvatar).toBeDefined();
    }

    // Save for the next step
    this.testState = Object.assign({}, this.testState || {}, { swimmers });
});
