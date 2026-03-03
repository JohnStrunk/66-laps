import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

interface SwimmerState {
    location: number;
}

When('swimmer is at location {float}', function (this: CustomWorld, location: number) {
    (this.swimmerState as SwimmerState).location = location;
});
