import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Then('the UI width should not be constrained to portrait dimensions', async function (this: CustomWorld) {
  if (!this.page) throw new Error('No page found');
  const width = await this.page.locator('main').evaluate(el => el.getBoundingClientRect().width);
  const viewport = this.page.viewportSize();

  if (viewport && viewport.width > 800) {
    // On a tablet (768+) or desktop, we expect it to take more space if it's not forcing portrait.
    // If it's forced to max-w-md, it would be 448px.
    assert.ok(width > 500, `UI width ${width} is still constrained to portrait dimensions on a large screen.`);
  }
});
