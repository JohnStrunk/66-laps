import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';
import { waitForVisible, waitForCondition } from '../../support/utils';
import { Page } from 'playwright';

async function waitFor3DReady(page: Page) {
    const readyDiv = page.locator('[data-test-ready="true"]').first();
    await waitForVisible(readyDiv);
    await expect(readyDiv).toBeVisible();

    await waitForCondition(page, async () => {
        return await readyDiv.evaluate((el) => el.hasAttribute('data-test-data'));
    }, 10000);
}

Then('I should see backstroke flags in the 3D scene', async function(this: CustomWorld) {
    await waitFor3DReady(this.page!);
    const data = await this.page!.evaluate(() => {
        const scene = (window as unknown as { __TEST_SCENE__?: { traverse: (cb: (obj: { isInstancedMesh?: boolean, isMesh?: boolean, geometry?: { type: string, parameters?: { radiusTop?: number, height?: number } }, count?: number, position: { x: number, y: number, z: number } }) => void) => void } }).__TEST_SCENE__;
        if (!scene) return { found: false, types: [] };
        let found = false;
        let types: string[] = [];
        scene.traverse((obj) => {
            if (obj.geometry) {
                types.push(obj.geometry.type + (obj.isInstancedMesh ? " (Instanced)" : ""));
            }
            if (obj.isInstancedMesh && obj.geometry && obj.geometry.type === 'ShapeGeometry') {
                found = true;
            }
        });
        return { found, types };
    });
    console.log('SCENE GEOMETRIES:', data.types);
    expect(data.found).toBe(true);
});
