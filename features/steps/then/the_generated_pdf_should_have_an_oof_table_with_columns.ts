import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

interface MockPDFDoc {
  __lastTableOptions?: {
    body?: string[][];
    head?: { content: string; colSpan?: number }[][];
  };
  internal: {
    getFont: () => { fontName: string };
  };
}

Then('the generated PDF should have an OOF table with {int} columns', async function (this: CustomWorld, expectedColumns: number) {
  // Wait for PDF to be generated and stored in window.__lastPDFDoc
  await this.page!.waitForFunction(() => !!(window as unknown as { __lastPDFDoc: MockPDFDoc }).__lastPDFDoc, { timeout: 10000 });

  const actualColumns = await this.page!.evaluate(() => {
    const doc = (window as unknown as { __lastPDFDoc: MockPDFDoc }).__lastPDFDoc;
    if (!doc || !doc.__lastTableOptions || !doc.__lastTableOptions.body || !doc.__lastTableOptions.body[0]) return 0;
    return doc.__lastTableOptions.body[0].length;
  });

  assert.strictEqual(actualColumns, expectedColumns, `OOF table should have ${expectedColumns} columns, but found ${actualColumns}`);
});

Then('the generated PDF should use {string} font', async function (this: CustomWorld, expectedFont: string) {
    // Wait for PDF to be generated and stored in window.__lastPDFDoc
    await this.page!.waitForFunction(() => !!(window as unknown as { __lastPDFDoc: MockPDFDoc }).__lastPDFDoc, { timeout: 10000 });

    const actualFont = await this.page!.evaluate(() => {
        const doc = (window as unknown as { __lastPDFDoc: MockPDFDoc }).__lastPDFDoc;
        if (!doc) return null;
        return doc.internal.getFont().fontName;
    });

    assert.strictEqual(actualFont, expectedFont, `PDF should use ${expectedFont} font, but found ${actualFont}`);
});
