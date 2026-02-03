import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { SwimmerModel, Direction } from '../../src/modules/SwimmerModel.ts';

let swimmer: SwimmerModel;
let startTime: number;
let currentTime: number;

Given('a race with lap times: {string}', function (lapTimesStr: string) {
  const lapTimes = lapTimesStr.split(',').map(s => parseFloat(s.trim()));
  startTime = 0; // Using 0 ensures determinism and simple elapsed time calculation
  swimmer = new SwimmerModel(lapTimes, startTime);
});

When('{int} seconds have elapsed', function (seconds: number) {
  currentTime = startTime + (seconds * 1000);
});

Then('the swimmer\'s location should be {float}', function (expectedLocation: number) {
  const actual = swimmer.where(currentTime);
  assert.equal(actual.location, expectedLocation);
});

Then('the swimmer\'s direction should be {string}', function (directionStr: string) {
  const expectedDirection = directionStr === 'TOTURN' ? Direction.TOTURN : Direction.TOSTART;
  const actual = swimmer.where(currentTime);
  assert.equal(actual.direction, expectedDirection, `Expected direction ${directionStr} but got ${actual.direction === Direction.TOTURN ? 'TOTURN' : 'TOSTART'}`);
});

Then('the race should be completed', function () {
  assert.equal(swimmer.isDone(currentTime), true);
});

Then('the race should not be completed', function () {
  assert.equal(swimmer.isDone(currentTime), false);
});
