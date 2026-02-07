import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

Given('the device has a {string} top safe area inset', async function (this: CustomWorld, inset: string) {
  if (!this.page) throw new Error('No page found');
  await this.page.addStyleTag({
    content: `:root { --simulated-safe-area-top: ${inset}; }`
  });
});
