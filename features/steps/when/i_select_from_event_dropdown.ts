import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { selectEvent } from '../../support/utils';

When('I select {string} from the Event Dropdown', async function (this: CustomWorld, eventName: string) {
  await selectEvent(this.page!, eventName);
});
