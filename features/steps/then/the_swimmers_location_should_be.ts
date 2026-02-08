import { Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { CustomWorld } from '../../support/world';

Then(`the swimmer's location should be {float}`, function (this: CustomWorld, expectedLocation: number) {
  const actual = this.swimmer!.where(this.currentTime!);
  assert.equal(actual.location, expectedLocation);
});
