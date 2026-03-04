import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
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
  expect(await this.page!.waitForFunction(() => !!(window as unknown as { __lastPDFDoc: MockPDFDoc }).__lastPDFDoc, { timeout: 10000 })).toBeTruthy();

  const actualColumns = await this.page!.evaluate(() => {
    const doc = (window as unknown as { __lastPDFDoc: MockPDFDoc }).__lastPDFDoc;
    if (!doc || !doc.__lastTableOptions || !doc.__lastTableOptions.body || !doc.__lastTableOptions.body[0]) return 0;
    return doc.__lastTableOptions.body[0].length;
  });

  expect(actualColumns, `OOF table should have ${expectedColumns} columns, but found ${actualColumns}`).toBe(expectedColumns);
});
