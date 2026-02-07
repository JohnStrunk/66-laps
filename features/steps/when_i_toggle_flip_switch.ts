import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

When('I toggle the Flip switch', async function (this: CustomWorld) {
  const flipSwitch = this.page!.getByLabel('Flip Lane Order');
  await flipSwitch.click({ force: true });
  await new Promise(r => setTimeout(r, 200));
});
