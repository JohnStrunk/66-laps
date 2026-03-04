import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the race should be completed', function (this: CustomWorld) {
  expect(this.swimmer!.isDone(this.currentTime!)).toBe(true);
});
