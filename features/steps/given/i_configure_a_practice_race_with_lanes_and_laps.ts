import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { selectDropdownItem } from '../../support/utils';

Given('I configure a practice race with {int} lanes and {int} laps', async function (this: CustomWorld, lanes: number, laps: number) {
    const page = this.page!;

    // Set Simulation Mode to 2D Overhead
    await selectDropdownItem(page, 'settings-Simulation Mode', '2D Overhead');

    // Set Number of Lanes
    await selectDropdownItem(page, 'settings-Number of Lanes', lanes.toString());

    // Set Race Length (2 laps is 50SC)
    const raceLengthLabel = laps === 2 ? '50 SC (2 Laps)' : `${laps * 25} SC`;
    await selectDropdownItem(page, 'settings-Race Length', raceLengthLabel);

    // Set Spread to Minimal to make it easier to predict
    await selectDropdownItem(page, 'settings-Spread', 'Minimal');
});

Given('I configure a 3D practice race with {int} lanes and {int} laps', async function (this: CustomWorld, lanes: number, laps: number) {
    const page = this.page!;

    // Set Simulation Mode to 3D Perspective
    await selectDropdownItem(page, 'settings-Simulation Mode', '3D Perspective');

    // Set Number of Lanes
    await selectDropdownItem(page, 'settings-Number of Lanes', lanes.toString());

    // Set Race Length (2 laps is 50SC)
    const raceLengthLabel = laps === 2 ? '50 SC (2 Laps)' : `${laps * 25} SC`;
    await selectDropdownItem(page, 'settings-Race Length', raceLengthLabel);

    // Set Spread to Minimal
    await selectDropdownItem(page, 'settings-Spread', 'Minimal');
});
