import { Then } from "@cucumber/cucumber";
import { expect } from '@playwright/test';
import { CustomWorld } from "../../support/world";
import { advanceClock } from "../../support/utils";

Then('a PDF file should be generated and downloaded as a fallback', async function (this: CustomWorld) {
    const start = Date.now();
    const timeout = 8000;
    let clicked = false;

    while (Date.now() - start < timeout) {
      clicked = await this.page!.evaluate(() => (window as unknown as { __downloadClicked: boolean }).__downloadClicked === true);
      if (clicked) break;
      await advanceClock(this.page!, 500);
      await this.page!.waitForTimeout(100);
    }

    expect(clicked, "Download was not triggered (fallback)").toBe(true);
});
