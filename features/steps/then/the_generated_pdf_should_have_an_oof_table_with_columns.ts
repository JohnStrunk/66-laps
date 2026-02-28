import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('the generated PDF should have an OOF table with {int} columns', async function (this: CustomWorld, expectedColumns: number) {
  // Wait for PDF to be generated and stored in window.__lastPDFDoc
  await this.page!.waitForFunction(() => !!(window as any).__lastPDFDoc, { timeout: 10000 });

  const actualColumns = await this.page!.evaluate(() => {
    const doc = (window as any).__lastPDFDoc;
    if (!doc || !doc.__lastTableOptions || !doc.__lastTableOptions.body || !doc.__lastTableOptions.body[0]) return 0;
    return doc.__lastTableOptions.body[0].length;
  });

  assert.strictEqual(actualColumns, expectedColumns, `OOF table should have ${expectedColumns} columns, but found ${actualColumns}`);
});
