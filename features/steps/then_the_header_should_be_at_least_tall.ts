import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

Then('the header should be at least {string} tall', async function (this: CustomWorld, minHeight: string) {
  return 'pending';
});
