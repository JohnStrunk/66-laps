import { Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import { selectDropdownItem } from '../../support/utils';
import { Page } from 'playwright';

async function configurePracticeRace(page: Page, lanes: number, mode: '2D Overhead' | '3D Perspective', laps: number) {
    if (laps <= 0) throw new Error('Laps must be positive');

    const currentMode = await page.locator('[data-testid="settings-Simulation Mode"]').textContent();
    if (!currentMode?.includes(mode)) {
        await selectDropdownItem(page, 'settings-Simulation Mode', mode);
    }

    const currentLanes = await page.locator('[data-testid="settings-Number of Lanes"]').textContent();
    if (!currentLanes?.includes(lanes.toString())) {
        await selectDropdownItem(page, 'settings-Number of Lanes', lanes.toString());
    }

    const currentLength = await page.locator('[data-testid="settings-Race Length"]').textContent();
    if (!currentLength?.includes('500 SC')) {
        await selectDropdownItem(page, 'settings-Race Length', '500 SC');
    }

    const currentSpread = await page.locator('[data-testid="settings-Spread"]').textContent();
    if (!currentSpread?.includes('Minimal')) {
        await selectDropdownItem(page, 'settings-Spread', 'Minimal');
    }

    const finalMode = await page.locator('[data-testid="settings-Simulation Mode"]').textContent();
    expect(finalMode).toContain(mode);
    const finalLanes = await page.locator('[data-testid="settings-Number of Lanes"]').textContent();
    expect(finalLanes).toContain(lanes.toString());
    const finalLength = await page.locator('[data-testid="settings-Race Length"]').textContent();
    expect(finalLength).toContain('500 SC');
    const finalSpread = await page.locator('[data-testid="settings-Spread"]').textContent();
    expect(finalSpread).toContain('Minimal');
}

Given('I configure a 3D practice race with {int} lanes and {int} laps', async function (this: CustomWorld, lanes: number, laps: number) {
    await configurePracticeRace(this.page!, lanes, '3D Perspective', laps);
});
