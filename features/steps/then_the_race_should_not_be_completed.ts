import { Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { CustomWorld } from '../support/world';

Then('the race should not be completed', function (this: CustomWorld) {
  assert.equal(this.swimmer!.isDone(this.currentTime!), false);
});
