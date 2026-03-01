import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

Given('start end at {float} and turn end at {float}', function (this: CustomWorld, startX: number, turnX: number) {
    this.swimmerState = {
        startEnd: { x: startX, y: 50 },
        turnEnd: { x: turnX, y: 50 },
        location: 0
    };
});
