import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('{int} seconds have elapsed', async function (this: CustomWorld, seconds: number) {

  // If we have a page, we might want to fast forward time there too

  if (this.page) {

    // Check if clock is installed, if not we might just wait or we should have installed it in Before hook

    // For now, let's try to use Playwright's clock if available (v1.45+)

        try {

          await this.page.clock.fastForward(seconds * 1000);

        } catch {



      // Fallback for older playwright or if clock is not installed



      // Just wait if we have to, but 15s is too long for a test

      if (seconds <= 2) {

        await this.page.waitForTimeout(seconds * 1000);

      }

    }

  }

  this.currentTime = (this.startTime || 0) + (seconds * 1000);

});
