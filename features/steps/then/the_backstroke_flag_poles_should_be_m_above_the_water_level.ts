import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForCondition } from '../../support/utils';

Then('the backstroke flag poles should be {float}m above the water level', async function(this: CustomWorld, height: number) {
    await waitForCondition(this.page!, async () => {
        const poleHeight = await this.page!.evaluate(() => {
            const scene = (window as unknown as { __TEST_SCENE__?: { traverse: (cb: (obj: { isInstancedMesh?: boolean, isMesh?: boolean, geometry?: { type: string, parameters?: { radiusTop?: number, height?: number } }, count?: number, position: { x: number, y: number, z: number } }) => void) => void } }).__TEST_SCENE__;
            if (!scene) return 0;
            let h = 0;
            scene.traverse((obj) => {
                if (obj.isMesh && obj.geometry && obj.geometry.type === 'CylinderGeometry') {
                    if (obj.geometry.parameters?.radiusTop === 0.025) {
                        h = obj.geometry.parameters.height || 0;
                    }
                }
            });
            return h;
        });
        // The pole height represents the distance from deck (0) to water level + 2m.
        // Water level is -0.5, deck is 0.
        // distance is (WATER_Y + height) - DECK_Y = -0.5 + 2 - 0 = 1.5.
        const expectedPoleHeight = -0.5 + height;
        return Math.abs(poleHeight - expectedPoleHeight) < 0.01;
    }, 10000);
});
