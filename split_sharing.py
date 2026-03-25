import os

content1 = """import { Given } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";

Given('the browser supports file sharing', async function (this: CustomWorld) {
  await this.page!.evaluate(() => {
    // Mock navigator.canShare and navigator.share
    (navigator as unknown as { canShare: (data?: unknown) => boolean }).canShare = () => true;
    (navigator as unknown as { share: (data?: unknown) => Promise<void> }).share = async (data?: unknown) => {
        (window as unknown as { __lastSharedData: unknown }).__lastSharedData = data;
        return Promise.resolve();
    };
  });
});
"""

content2 = """import { Given } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";

Given('the browser does not support file sharing', async function (this: CustomWorld) {
    await this.page!.evaluate(() => {
      // Mock navigator.canShare to return false
      (navigator as unknown as { canShare: (data?: unknown) => boolean }).canShare = () => false;
      // Mock navigator.share to throw if called
      (navigator as unknown as { share: (data?: unknown) => Promise<void> }).share = async () => {
          throw new Error('Share not supported');
      };
    });
});
"""

with open("features/steps/given/the_browser_supports_file_sharing.ts", "w") as f:
    f.write(content1)

with open("features/steps/given/the_browser_does_not_support_file_sharing.ts", "w") as f:
    f.write(content2)
