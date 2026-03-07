import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I clear the Event Number field', async function (this: CustomWorld) {
  const input = this.page!.getByTestId('event-number-input');
  await input.clear();
});
