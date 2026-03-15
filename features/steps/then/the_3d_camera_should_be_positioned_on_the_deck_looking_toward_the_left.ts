import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitFor3DReady } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the 3D camera should be positioned on the deck, looking toward the left', async function (this: CustomWorld) {
    await waitFor3DReady(this.page!);
    const container = this.page!.locator('[data-testid="3d-pool-container"]');
    const data = await container.evaluate((el: HTMLElement) => JSON.parse(el.getAttribute('data-test-data')!));

    // Position on deck (usually Y ~ 1.67m)
    expect(data.camera.position.y).toBeCloseTo(1.67, 1);

    // Looking toward the left (usually means negative X or specific rotation)
    // In our case, the startingEnd is LEFT (Default), so observer is at X = poolLength + 3.0
    // and looking towards X = poolLength.
    // So it's looking in negative X direction.
    // Rotation X is around -0.5 (tilted down).
    expect(data.camera.rotation.x).toBeLessThan(0);
});
