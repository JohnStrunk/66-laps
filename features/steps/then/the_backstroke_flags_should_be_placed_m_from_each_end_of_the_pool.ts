import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the backstroke flags should be placed {float}m from each end of the pool', async function(this: CustomWorld, distance: number) {
    const positions = await this.page!.evaluate(() => {
        const scene = (window as unknown as { __TEST_SCENE__?: { traverse: (cb: (obj: { isInstancedMesh?: boolean, isMesh?: boolean, geometry?: { type: string, parameters?: { radiusTop?: number, height?: number } }, count?: number, position: { x: number, y: number, z: number } }) => void) => void } }).__TEST_SCENE__;
        if (!scene) return [];
        const positions: number[] = [];
        scene.traverse((obj) => {
            if (obj.isMesh && obj.geometry && obj.geometry.type === 'CylinderGeometry') {
                // Find poles
                if (obj.geometry.parameters?.radiusTop === 0.025) {
                    positions.push(obj.position.x);
                }
            }
        });
        return positions;
    });
    expect(positions).toContain(distance);
    // At least one position should be greater than the distance (meaning it's at the other end)
    expect(positions.some(p => p > distance)).toBe(true);
});
