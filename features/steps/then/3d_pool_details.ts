import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { strict as assert } from 'assert';
import { advanceClock, waitForVisible } from '../../support/utils';
import { TestWindow } from '../../../src/modules/testTypes';
import { Page } from 'playwright';
import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three';

async function waitFor3DReady(page: Page) {
    console.log("Waiting for pool-3d-container");
    await waitForVisible(page.getByTestId('pool-3d-container'));

    console.log("Advancing clock for Canvas initialization");
    for (let i = 0; i < 100; i++) {
        await advanceClock(page, 16);
    }

    console.log("Waiting for canvas[data-test-ready='true']");
    const canvas = page.locator('canvas[data-test-ready="true"]');
    await waitForVisible(canvas);
}

Then('the 3D water surface should be at a Y-coordinate of {float}', async function (this: CustomWorld, expectedY: number) {
    await waitFor3DReady(this.page!);
    const waterY = await this.page!.evaluate(() => {
        const testWin = window as unknown as TestWindow;
        const scene = testWin.__TEST_SCENE__;
        let y: number | null = null;
        scene?.traverse((obj) => {
            const mesh = obj as Mesh;
            if (mesh.isMesh && mesh.material) {
                const mat = mesh.material as MeshStandardMaterial;
                if (mat.color && mat.color.getHexString() === '44aaff') {
                    y = mesh.position.y;
                }
            }
        });
        return y;
    });
    assert.strictEqual(waterY, expectedY, `Water surface Y was ${waterY}, expected ${expectedY}`);
});

Then('the 3D pool deck should be at a Y-coordinate of {float}', async function (this: CustomWorld, expectedY: number) {
    await waitFor3DReady(this.page!);
    const deckYs = await this.page!.evaluate(() => {
        const testWin = window as unknown as TestWindow;
        const scene = testWin.__TEST_SCENE__;
        const ys: number[] = [];
        scene?.traverse((obj) => {
            const mesh = obj as Mesh;
            if (mesh.isMesh && mesh.material) {
                const mat = mesh.material as MeshStandardMaterial;
                if (mat.color && mat.color.getHexString() === 'cccccc') {
                    ys.push(mesh.position.y);
                }
            }
        });
        return ys;
    });
    assert.ok(deckYs.length > 0, "No deck meshes found");
    deckYs.forEach(y => {
        assert.strictEqual(y, expectedY, `Deck mesh Y was ${y}, expected ${expectedY}`);
    });
});

Then('the 3D lane ropes should be at a Y-coordinate of {float}', async function (this: CustomWorld, expectedY: number) {
    await waitFor3DReady(this.page!);
    const ropeYs = await this.page!.evaluate(() => {
        const testWin = window as unknown as TestWindow;
        const scene = testWin.__TEST_SCENE__;
        const ys: number[] = [];
        scene?.traverse((obj) => {
            const mesh = obj as Mesh;
            if (mesh.isMesh && mesh.material) {
                const mat = mesh.material as MeshStandardMaterial;
                if (mat.color && mat.color.getHexString() === 'c0c0c0') {
                    ys.push(mesh.position.y);
                }
            }
        });
        return ys;
    });
    assert.ok(ropeYs.length > 0, "No lane rope meshes found");
    ropeYs.forEach(y => {
        assert.strictEqual(y, expectedY, `Lane rope Y was ${y}, expected ${expectedY}`);
    });
});

Then('the 3D swimmers should be at a Y-coordinate of {float}', async function (this: CustomWorld, expectedY: number) {
    await waitFor3DReady(this.page!);
    const swimmerYs = await this.page!.evaluate(() => {
        const testWin = window as unknown as TestWindow;
        const scene = testWin.__TEST_SCENE__;
        const ys: number[] = [];
        scene?.traverse((obj) => {
            if (obj.type === 'Group' && obj.children.length > 0 && (obj.children[0] as Mesh).isMesh) {
                if (obj === testWin.__TEST_SWIMMER_0__ || (obj.parent === scene && obj.position.y !== 0 && Math.abs(obj.position.y - (-0.5)) < 0.1)) {
                     ys.push(obj.position.y);
                }
            }
        });
        return ys;
    });
    assert.ok(swimmerYs.length > 0, "No swimmers found");
    swimmerYs.forEach(y => {
        assert.strictEqual(y, expectedY, `Swimmer Y was ${y}, expected ${expectedY}`);
    });
});

Then('I should see 3D lane markers for each lane', async function (this: CustomWorld) {
    await waitFor3DReady(this.page!);
    const markerCount = await this.page!.evaluate(() => {
        const testWin = window as unknown as TestWindow;
        const scene = testWin.__TEST_SCENE__;
        let count = 0;
        scene?.traverse((obj) => {
            if (obj.type === 'Group' && obj.children.some((c) => {
                const mesh = c as Mesh;
                return mesh.isMesh && mesh.geometry?.type === 'BoxGeometry' && (mesh.material as MeshStandardMaterial)?.color?.getHexString() === 'ffffff';
            })) {
                count++;
            }
        });
        return count;
    });
    assert.ok(markerCount >= 1, `Expected at least 1 lane marker, found ${markerCount}`);
});

Then('each 3D lane marker should be a white panel {float}m square', async function (this: CustomWorld, size: number) {
    const dimensions = await this.page!.evaluate(() => {
        const testWin = window as unknown as TestWindow;
        const scene = testWin.__TEST_SCENE__;
        const results: { width: number, height: number, depth: number }[] = [];
        scene?.traverse((obj) => {
            const mesh = obj as Mesh;
            if (mesh.isMesh && mesh.geometry?.type === 'BoxGeometry' && (mesh.material as MeshStandardMaterial)?.color?.getHexString() === 'ffffff') {
                const geo = mesh.geometry as BoxGeometry;
                results.push({
                    width: geo.parameters.width,
                    height: geo.parameters.height,
                    depth: geo.parameters.depth
                });
            }
        });
        return results;
    });

    assert.ok(dimensions.length > 0, "No lane marker panels found");
    dimensions.forEach(dim => {
        const values = [dim.width, dim.height, dim.depth].sort((a, b) => a - b);
        assert.ok(Math.abs(values[1] - size) < 0.01, `Marker size incorrect: ${values[1]}, expected ${size}`);
        assert.ok(Math.abs(values[2] - size) < 0.01, `Marker size incorrect: ${values[2]}, expected ${size}`);
    });
});

Then('each 3D lane marker should be oriented parallel to the side walls', async function (this: CustomWorld) {
    const isParallel = await this.page!.evaluate(() => {
        const testWin = window as unknown as TestWindow;
        const scene = testWin.__TEST_SCENE__;
        let parallel = true;
        scene?.traverse((obj) => {
            const mesh = obj as Mesh;
            if (mesh.isMesh && mesh.geometry?.type === 'BoxGeometry' && (mesh.material as MeshStandardMaterial)?.color?.getHexString() === 'ffffff') {
                const geo = mesh.geometry as BoxGeometry;
                if (geo.parameters.depth !== 0.02) {
                    parallel = false;
                }
            }
        });
        return parallel;
    });
    assert.ok(isParallel, "Lane markers are not oriented parallel to side walls (thickness should be in Z direction)");
});

Then('each 3D lane marker should be placed on the deck at the end of the lane', async function (this: CustomWorld) {
    const positions = await this.page!.evaluate(() => {
        const testWin = window as unknown as TestWindow;
        const scene = testWin.__TEST_SCENE__;
        const results: { x: number, y: number, z: number }[] = [];
        scene?.traverse((obj) => {
            if (obj.type === 'Group' && obj.children.some((c) => {
                const mesh = c as Mesh;
                return mesh.isMesh && mesh.geometry?.type === 'BoxGeometry' && (mesh.material as MeshStandardMaterial)?.color?.getHexString() === 'ffffff';
            })) {
                results.push({ x: obj.position.x, y: obj.position.y, z: obj.position.z });
            }
        });
        return results;
    });

    assert.ok(positions.length > 0, "No lane markers found");
    positions.forEach(pos => {
        assert.ok(Math.abs(pos.y - 0.165) < 0.01, `Marker Y position incorrect: ${pos.y}, expected 0.165`);
        assert.ok(Math.abs(pos.x) === 0.2 || pos.x > 20, `Marker X position incorrect: ${pos.x}`);
    });
});
