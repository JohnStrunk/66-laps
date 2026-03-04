import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the verification should be successful', function (this: CustomWorld) {
  expect(this.verificationSuccess, `Verification failed: ${this.verificationError}`).toBe(true);
});
