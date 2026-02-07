import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

Given('the viewport is {string}', async function (this: CustomWorld, viewportSize: string) {
  // Parse viewportSize (e.g., "360x640")
  return 'pending';
});
