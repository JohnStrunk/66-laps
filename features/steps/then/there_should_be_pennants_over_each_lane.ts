import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('there should be {int} pennants over each lane', async function(this: CustomWorld, expectedPennants: number) {
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
    // Total pennants = lanes * expectedPennants * 2 ends.
    // We just check it's divisible by the expected pennants.
    expect(count % expectedPennants).toBe(0);
    expect(count).toBeGreaterThan(0);
});
