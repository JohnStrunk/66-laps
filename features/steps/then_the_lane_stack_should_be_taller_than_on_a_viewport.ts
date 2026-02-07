import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

Then('the lane stack should be taller than on a {string} viewport', async function (this: CustomWorld, otherViewport: string) {
  return 'pending';
});
