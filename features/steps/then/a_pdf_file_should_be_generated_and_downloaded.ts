import { Then } from "@cucumber/cucumber";
import assert from "node:assert";
import { CustomWorld } from "../../support/world";

Then('a PDF file should be generated and downloaded', async function (this: CustomWorld) {
  // Wait for the download to be triggered (async generation might take a moment)
  await this.page!.waitForFunction(() => (window as unknown as { __downloadClicked: boolean }).__downloadClicked === true, { timeout: 10000 });
  const clicked = await this.page!.evaluate(() => (window as unknown as { __downloadClicked: boolean }).__downloadClicked);
  assert.strictEqual(clicked, true, "Download was not triggered");
});

Then('a PDF file should be generated and downloaded as a fallback', async function (this: CustomWorld) {
    await this.page!.waitForFunction(() => (window as unknown as { __downloadClicked: boolean }).__downloadClicked === true, { timeout: 10000 });
    const clicked = await this.page!.evaluate(() => (window as unknown as { __downloadClicked: boolean }).__downloadClicked);
    assert.strictEqual(clicked, true, "Download was not triggered (fallback)");
  });
