import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

When('{int} seconds have elapsed', function (this: CustomWorld, seconds: number) {
  this.currentTime = (this.startTime || 0) + (seconds * 1000);
});
