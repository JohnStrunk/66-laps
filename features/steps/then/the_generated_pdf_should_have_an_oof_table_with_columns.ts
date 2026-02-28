import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

interface MockPDFDoc {
  __lastTableOptions?: {
    body?: string[][];
    head?: { content: string; colSpan?: number }[][];
    styles?: { font?: string; fontStyle?: string; textColor?: number | number[] };
    columnStyles?: { [key: number]: { fontStyle?: string } };
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

    const fontInfo = await this.page!.evaluate(() => {
        const doc = (window as unknown as { __lastPDFDoc: MockPDFDoc }).__lastPDFDoc;
        if (!doc) return null;
        return {
            docFont: doc.internal.getFont().fontName,
            tableFont: doc.__lastTableOptions?.styles?.font,
            tableStyle: doc.__lastTableOptions?.styles?.fontStyle,
            tableColor: doc.__lastTableOptions?.styles?.textColor,
            col0Style: doc.__lastTableOptions?.columnStyles?.[0]?.fontStyle
        };
    });

    assert.ok(fontInfo, "PDF font info not found");
    assert.strictEqual(fontInfo.docFont, expectedFont, `PDF document should use ${expectedFont} font, but found ${fontInfo.docFont}`);
    assert.strictEqual(fontInfo.tableFont, expectedFont, `OOF table should use ${expectedFont} font, but found ${fontInfo.tableFont}`);
    assert.strictEqual(fontInfo.tableStyle || 'normal', 'normal', "OOF table body should be normal (lane numbers)");
    assert.strictEqual(fontInfo.col0Style, 'bold', "OOF table LAP column should be bold");
    assert.strictEqual(fontInfo.tableColor, 0, `OOF table body text color should be black (0), but found ${fontInfo.tableColor}`);
});
