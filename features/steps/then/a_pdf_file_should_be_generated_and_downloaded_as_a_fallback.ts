import { Then } from "@cucumber/cucumber";
import { expect } from '@playwright/test';
import { CustomWorld } from "../../support/world";

Then('a PDF file should be generated and downloaded as a fallback', async function (this: CustomWorld) {
    expect(await this.page!.waitForFunction(() => (window as unknown as { __downloadClicked: boolean }).__downloadClicked === true, { timeout: 10000 })).toBeTruthy();
    const clicked = await this.page!.evaluate(() => (window as unknown as { __downloadClicked: boolean }).__downloadClicked);
    expect(clicked, "Download was not triggered (fallback)").toBe(true);
});
