import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I clear the Heat Number field', async function (this: CustomWorld) {
  const input = this.page!.getByTestId('heat-number-input');
  await input.clear();
});
