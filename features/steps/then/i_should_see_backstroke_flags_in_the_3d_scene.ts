import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitFor3DReady, waitForCondition } from '../../support/utils';

Then('I should see backstroke flags in the 3D scene', async function(this: CustomWorld) {
    await waitFor3DReady(this.page!);

    await waitForCondition(this.page!, async () => {
        return await this.page!.evaluate(() => {
            const scene = (window as unknown as { __TEST_SCENE__?: { traverse: (cb: (obj: { isInstancedMesh?: boolean, isMesh?: boolean, geometry?: { type: string, parameters?: { radiusTop?: number, height?: number } }, count?: number, position: { x: number, y: number, z: number } }) => void) => void } }).__TEST_SCENE__;
            if (!scene) return false;
            let found = false;
            scene.traverse((obj) => {
                if (obj.isInstancedMesh && obj.geometry && obj.geometry.type === 'ShapeGeometry') {
                    found = true;
                }
            });
            return found;
        });
    }, 10000);
});
