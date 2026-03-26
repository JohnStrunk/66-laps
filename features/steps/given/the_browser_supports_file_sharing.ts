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
