import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock } from '../../support/utils';

Given('I wait {int} milliseconds', async function (this: CustomWorld, ms: number) {
  await advanceClock(this.page!, ms);
});
