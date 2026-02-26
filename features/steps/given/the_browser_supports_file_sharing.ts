import { Given } from "@cucumber/cucumber";
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
