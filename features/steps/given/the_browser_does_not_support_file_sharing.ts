import { Given } from "@cucumber/cucumber";
import { expect } from '@playwright/test';
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

    const canShare = await this.page!.evaluate(() => navigator.canShare());
    expect(canShare).toBe(false);
});
