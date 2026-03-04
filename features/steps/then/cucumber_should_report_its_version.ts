import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('cucumber should report its version', function (this: CustomWorld) {
  expect(this.cucumberVersion, 'Cucumber version should be reported').toBeTruthy();
});
