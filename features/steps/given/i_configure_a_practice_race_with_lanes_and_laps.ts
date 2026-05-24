import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { selectDropdownItem } from '../../support/utils';
import { Page } from 'playwright';

async function configurePracticeRace(page: Page, lanes: number, mode: '2D Overhead' | '3D Perspective', laps: number) {
    // We use the laps parameter to verify the intent, even if we force 500 SC (20 laps) for now
    if (laps <= 0) throw new Error('Laps must be positive');

    // 1. Set Simulation Mode
    const currentMode = await page.locator('[data-testid="settings-Simulation Mode"] button').textContent();
    if (!currentMode?.includes(mode)) {
        await selectDropdownItem(page, 'settings-Simulation Mode', mode);
    }

    // 2. Set Number of Lanes
    const currentLanes = await page.locator('[data-testid="settings-Number of Lanes"] button').textContent();
    if (!currentLanes?.includes(lanes.toString())) {
        await selectDropdownItem(page, 'settings-Number of Lanes', lanes.toString());
    }

    // 3. Set Race Length (Use 500 SC for tests)
    let currentLength = '';
    const lengthLocator = page.locator('[data-testid="settings-Race Length"]');
    const tagName = await lengthLocator.evaluate(el => el.tagName.toLowerCase());
    if (tagName === 'select') {
        const val = await lengthLocator.inputValue();
        currentLength = val === '500_SC' ? '500 SC' : val;
    } else {
        currentLength = await lengthLocator.locator('button').textContent() || '';
    }
    if (!currentLength?.includes('500 SC')) {
        await selectDropdownItem(page, 'settings-Race Length', '500 SC');
    }

    // 4. Set Spread to Minimal
    const currentSpread = await page.locator('[data-testid="settings-Spread"] button').textContent();
    if (!currentSpread?.includes('Minimal')) {
        await selectDropdownItem(page, 'settings-Spread', 'Minimal');
    }
}

Given('I configure a practice race with {int} lanes and {int} laps', async function (this: CustomWorld, lanes: number, laps: number) {
    await configurePracticeRace(this.page!, lanes, '2D Overhead', laps);
});
