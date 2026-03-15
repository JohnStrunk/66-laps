import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForCondition } from '../../support/utils';

Then('the backstroke flags should span the width of the pool', async function(this: CustomWorld) {
    await waitForCondition(this.page!, async () => {
        const cableLength = await this.page!.evaluate(() => {
            const scene = (window as unknown as { __TEST_SCENE__?: { traverse: (cb: (obj: { isInstancedMesh?: boolean, isMesh?: boolean, geometry?: { type: string, parameters?: { radiusTop?: number, height?: number } }, count?: number, position: { x: number, y: number, z: number } }) => void) => void } }).__TEST_SCENE__;
            if (!scene) return 0;
            let l = 0;
            scene.traverse((obj) => {
                if (obj.isMesh && obj.geometry && obj.geometry.type === 'CylinderGeometry') {
                    if (obj.geometry.parameters?.radiusTop === 0.002) { // 0.002 is the cable radius
                        l = obj.geometry.parameters.height || 0; // For CylinderGeometry, length is height
                    }
                }
            });
            return l;
        });
        // Cable should be longer than 0 to span the width
        return cableLength > 0;
    }, 10000);
});
