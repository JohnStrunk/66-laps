import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then(`the swimmer's location should be {float}`, function (this: CustomWorld, expectedLocation: number) {
  const actual = this.swimmer!.where(this.currentTime!);
  expect(actual.location).toBe(expectedLocation);
});
