import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Then('the verification should be successful', function (this: CustomWorld) {
  assert.strictEqual(this.verificationSuccess, true, `Verification failed: ${this.verificationError}`);
});
