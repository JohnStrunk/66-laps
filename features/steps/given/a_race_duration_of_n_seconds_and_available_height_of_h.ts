import { Given } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";

import assert from 'node:assert';

Given('a race duration of {float} seconds and available height of {float}', function (this: CustomWorld, duration: number, height: number) {
    this.pdfDuration = duration;
    this.pdfHeight = height;
    assert.strictEqual(this.pdfDuration, duration);
    assert.strictEqual(this.pdfHeight, height);
});
