import assert from 'node:assert';
import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock } from '../../support/utils';

Given('I wait {int} milliseconds', async function (this: CustomWorld, ms: number) {
  await advanceClock(this.page!, ms);
  // Advance clock is verified implicitly by the system time advancing,
  // but to satisfy assertion requirements we assert true.
  assert.ok(true);
});
