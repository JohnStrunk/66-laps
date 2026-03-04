import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { selectDropdownItem } from '../../support/utils';

async function configurePracticeRace(page: any, lanes: number, mode: '2D Overhead' | '3D Perspective') {
    // 1. Set Simulation Mode
    const currentMode = await page.locator('[data-testid="settings-Simulation Mode"]').textContent();
    if (!currentMode?.includes(mode)) {
        await selectDropdownItem(page, 'settings-Simulation Mode', mode);
    }

    // 2. Set Number of Lanes
    const currentLanes = await page.locator('[data-testid="settings-Number of Lanes"]').textContent();
    if (!currentLanes?.includes(lanes.toString())) {
        await selectDropdownItem(page, 'settings-Number of Lanes', lanes.toString());
    }

    // 3. Set Race Length (Use 500 SC for tests)
    const currentLength = await page.locator('[data-testid="settings-Race Length"]').textContent();
    if (!currentLength?.includes('500 SC')) {
        await selectDropdownItem(page, 'settings-Race Length', '500 SC');
    }

    // 4. Set Spread to Minimal
    const currentSpread = await page.locator('[data-testid="settings-Spread"]').textContent();
    if (!currentSpread?.includes('Minimal')) {
        await selectDropdownItem(page, 'settings-Spread', 'Minimal');
    }
}

Given('I configure a practice race with {int} lanes and {int} laps', async function (this: CustomWorld, lanes: number, _laps: number) {
    await configurePracticeRace(this.page!, lanes, '2D Overhead');
});

Given('I configure a 3D practice race with {int} lanes and {int} laps', async function (this: CustomWorld, lanes: number, _laps: number) {
    await configurePracticeRace(this.page!, lanes, '3D Perspective');
});
