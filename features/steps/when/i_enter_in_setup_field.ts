import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I enter {string} in the Event Number field', async function (this: CustomWorld, value: string) {
  const input = this.page!.getByTestId('event-number-input');
  await input.fill(value);
});

When('I enter {string} in the Heat Number field', async function (this: CustomWorld, value: string) {
  const input = this.page!.getByTestId('heat-number-input');
  await input.fill(value);
});
