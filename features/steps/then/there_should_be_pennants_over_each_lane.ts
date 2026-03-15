import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForCondition } from '../../support/utils';

Then('there should be {int} pennants over each lane', async function(this: CustomWorld, expectedPennants: number) {
    await waitForCondition(this.page!, async () => {
        const count = await this.page!.evaluate(() => {
            const scene = (window as unknown as { __TEST_SCENE__?: { traverse: (cb: (obj: { isInstancedMesh?: boolean, isMesh?: boolean, geometry?: { type: string, parameters?: { radiusTop?: number, height?: number } }, count?: number, position: { x: number, y: number, z: number } }) => void) => void } }).__TEST_SCENE__;
            if (!scene) return 0;
            let count = 0;
            scene.traverse((obj) => {
                if (obj.isInstancedMesh && obj.geometry && obj.geometry.type === 'ShapeGeometry') {
                    count = obj.count || 0;
                }
            });
            return count;
        });
        return count > 0 && count % expectedPennants === 0;
    }, 10000);
});
