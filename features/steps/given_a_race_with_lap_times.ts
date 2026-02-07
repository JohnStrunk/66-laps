import { Given } from '@cucumber/cucumber';
import { SwimmerModel } from '../../src/modules/SwimmerModel';
import { CustomWorld } from '../support/world';

Given('a race with lap times: {string}', function (this: CustomWorld, lapTimesStr: string) {
  const lapTimes = lapTimesStr.split(',').map(s => parseFloat(s.trim()));
  this.startTime = 0;
  this.swimmer = new SwimmerModel(lapTimes, this.startTime);
});
