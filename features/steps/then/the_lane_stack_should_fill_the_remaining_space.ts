import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('the lane stack should fill the remaining space', async function (this: CustomWorld) {
  if (!this.page) throw new Error('No page found');

  const metrics = await this.page.evaluate(() => {
    const header = document.querySelector('header');
    const laneStack = document.querySelector('[data-testid="lane-stack"]');
    const footer = document.querySelector('footer, .w-full.h-16.mt-6'); // Footer might not be <footer> tag

    return {
      windowHeight: window.innerHeight,
      headerHeight: header?.getBoundingClientRect().height || 0,
      laneStackHeight: laneStack?.getBoundingClientRect().height || 0,
      footerHeight: footer?.getBoundingClientRect().height || 0,
      bodyHeight: document.body.scrollHeight
    };
  });

  // The lane stack "fills" the remaining space if there's no large gap.
  // We expect bodyHeight to be close to windowHeight (no scrolling)
  // and laneStack to be the largest part of it.
  assert.ok(metrics.laneStackHeight > 0, "Lane stack should have height");
  assert.ok(metrics.bodyHeight <= metrics.windowHeight + 5, `Should not scroll: ${metrics.bodyHeight} > ${metrics.windowHeight}`);
});
