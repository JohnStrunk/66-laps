import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Then('cucumber should report its version', function (this: CustomWorld) {
  assert.ok(this.cucumberVersion, 'Cucumber version should be reported');
});
