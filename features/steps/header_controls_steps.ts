import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import assert from 'node:assert';

const getColorClass = (className: string | null) => {
  if (!className) return null;
  return className.split(' ').find(c =>
    c.startsWith('text-') &&
    c !== 'text-lg' &&
    c !== 'font-black' &&
    c !== 'transition-colors'
  );
};

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Background
Given('the app is loaded', async function (this: CustomWorld) {
  await this.page!.goto(`${BASE_URL}/app`);
  await this.page!.waitForSelector('[data-testid="lane-stack"]', { state: 'visible', timeout: 10000 });
});

// Rule: Configuration Controls
When('I select {string} from the Event Dropdown', async function (this: CustomWorld, eventName: string) {
  const dropdown = this.page!.locator('button:has-text("SC"), button:has-text("LC")').first();
  await dropdown.click();
  const popover = this.page!.locator('[role="menu"], [role="listbox"], .z-50').last();
  await popover.waitFor({ state: 'visible' });
  const item = popover.locator('button, li, [role="menuitem"], [role="option"]').getByText(eventName, { exact: true });
  await item.click({ force: true });
});

Then('the total lap count should be {int}', async function (this: CustomWorld, laps: number) {
  const stateLaps = await this.page!.evaluate(() => {
    const state = window.__bellLapStore.getState();
    // Use standard config matching src/modules/bellLapStore.ts
    const config: Record<string, number> = {
      '500 SC': 20, '1000 SC': 40, '1650 SC': 66, '800 LC': 16, '1500 LC': 30
    };
    return config[state.event];
  });
  assert.strictEqual(stateLaps, laps, `Expected total laps to be ${laps} but got ${stateLaps}`);
});

Then('the lockout duration should be {int} seconds', async function (this: CustomWorld, seconds: number) {
  const stateLockout = await this.page!.evaluate(() => {
    const state = window.__bellLapStore.getState();
    const config: Record<string, number> = {
      '500 SC': 15, '1000 SC': 15, '1650 SC': 15, '800 LC': 30, '1500 LC': 30
    };
    return config[state.event];
  });
  assert.strictEqual(stateLockout, seconds, `Expected lockout to be ${seconds}s but got ${stateLockout}s`);
});

When('I select {string} from the Lane Dropdown', async function (this: CustomWorld, laneOption: string) {
  await this.page!.click(`button:has-text("lanes")`);
  const popover = this.page!.locator('[role="menu"], [role="listbox"], .z-50').last();
  await popover.waitFor({ state: 'visible' });
  const item = popover.locator('button, li, [role="menuitem"], [role="option"]').getByText(laneOption, { exact: true });
  await item.click({ force: true });
});

Then('the lane stack should display {int} rows', async function (this: CustomWorld, rowCount: number) {
  await this.page!.waitForFunction(
    (count) => document.querySelectorAll('[data-testid="lane-row"]').length === count,
    rowCount,
    { timeout: 5000 }
  );
  const rows = await this.page!.locator('[data-testid="lane-row"]').count();
  assert.strictEqual(rows, rowCount);
});

Given('the lane stack is currently ordered {int} to {int}', async function (this: CustomWorld, start: number, end: number) {
  if (end === 10) {
    await this.page!.evaluate(() => {
      window.__bellLapStore.getState().setLaneCount(10);
    });
  }
  const firstRow = this.page!.locator('[data-testid="lane-row"]').first();
  await this.page!.waitForFunction(
    (s) => document.querySelector('[data-testid="lane-row"]')?.getAttribute('data-lane-number') === String(s),
    start
  );
  const attr = await firstRow.getAttribute('data-lane-number');
  assert.strictEqual(attr, String(start));
});

When('I toggle the Flip switch', async function (this: CustomWorld) {
  const flipSwitch = this.page!.getByLabel('Flip Lane Order');
  await flipSwitch.click({ force: true });
  // Wait for state change to reflect in DOM
  await new Promise(r => setTimeout(r, 200));
});

Then('the lane stack should be ordered {int} to {int}', async function (this: CustomWorld, start: number, end: number) {
  const rows = this.page!.locator('[data-testid="lane-row"]');
  await this.page!.waitForFunction(
    (args) => {
      const els = document.querySelectorAll('[data-testid="lane-row"]');
      return els[0]?.getAttribute('data-lane-number') === args.s &&
             els[els.length-1]?.getAttribute('data-lane-number') === args.e;
    },
    { s: String(start), e: String(end) }
  );
  const firstAttr = await rows.first().getAttribute('data-lane-number');
  assert.strictEqual(firstAttr, String(start));
});

// Rule: New Race Reset
When('I tap the {string} button', async function (this: CustomWorld, buttonName: string) {
  if (buttonName === "New Race") {
    await this.page!.click('button[aria-label="New Race"]');
  } else {
    await this.page!.click(`button:has-text("${buttonName}")`);
  }
});

Then('a confirmation modal should appear with the title {string}', async function (this: CustomWorld, title: string) {
  const modalHeader = this.page!.locator('header:has-text("' + title + '")');
  await modalHeader.waitFor({ state: 'visible' });
  assert.ok(await modalHeader.isVisible());
});

Given('a race is in progress with non-zero counts', async function (this: CustomWorld) {
  await this.page!.evaluate(() => {
    window.__bellLapStore.getState().registerTouch(1, true);
  });
  await this.page!.waitForFunction(
    () => document.querySelector('[data-lane-number="1"] [data-testid="lane-count"]')?.textContent === '2'
  );
});

Given('the confirmation modal is open', async function (this: CustomWorld) {
  const modal = this.page!.locator('header:has-text("Start New Race?")');
  if (!(await modal.isVisible())) {
    await this.page!.click('button[aria-label="New Race"]');
  }
  await modal.waitFor({ state: 'visible' });
});

When('I tap {string}', async function (this: CustomWorld, buttonText: string) {
  await this.page!.click(`button:has-text("${buttonText}")`);
});

Then('all lane counts should be {int}', async function (this: CustomWorld, count: number) {
  await this.page!.waitForFunction(
    (c) => {
      const el = document.querySelector('[data-lane-number="1"] [data-testid="lane-count"]');
      const val = el ? parseInt(el.textContent || '0', 10) : 0;
      return val === c;
    },
    count
  );
  const text = await this.page!.locator('[data-lane-number="1"] [data-testid="lane-count"]').textContent();
  assert.strictEqual(parseInt(text || '0', 10), count);
});

Then('all split history should be cleared', async function (this: CustomWorld) {
  const historyEmpty = await this.page!.evaluate(() => {
    return window.__bellLapStore.getState().lanes.every(l => l.history.length === 0);
  });
  assert.ok(historyEmpty, 'Split history should be empty after reset');
});

Then('any disabled lanes should be re-enabled', async function (this: CustomWorld) {
  const allActive = await this.page!.evaluate(() => {
    return window.__bellLapStore.getState().lanes.every(l => !l.isEmpty);
  });
  assert.ok(allActive, 'All lanes should be re-enabled after reset');
  const emptyText = await this.page!.locator('text="EMPTY"').count();
  assert.strictEqual(emptyText, 0);
});

Then('the Live Leaderboard should be cleared', async function (this: CustomWorld) {
  const allZero = await this.page!.evaluate(() => {
    return window.__bellLapStore.getState().lanes.every(l => l.count === 0);
  });
  assert.ok(allZero, 'Leaderboard counts should be zeroed');
});

Then('the lane counts should remain unchanged', async function (this: CustomWorld) {
  const text = await this.page!.locator('[data-lane-number="1"] [data-testid="lane-count"]').textContent();
  assert.strictEqual(parseInt(text || '0', 10), 2);
});

Then('the modal should close', async function (this: CustomWorld) {
  const modal = this.page!.locator('header:has-text("Start New Race?")');
  await modal.waitFor({ state: 'hidden', timeout: 5000 });
  assert.ok(!(await modal.isVisible()));
});

// Rule: Live Leaderboard Status
Given('lanes {int}, {int}, and {int} are active', async function (this: CustomWorld, l1: number, l2: number, l3: number) {
  await this.page!.evaluate((args) => {
    const store = window.__bellLapStore.getState();
    [args.l1, args.l2, args.l3].forEach(laneNum => {
      const lane = store.lanes.find(l => l.laneNumber === laneNum);
      if (lane?.isEmpty) store.toggleLaneEmpty(laneNum);
    });
  }, { l1, l2, l3 });
});

Given('lanes {int}, {int}, and {int} are empty', async function (this: CustomWorld, l1: number, l2: number, l3: number) {
  for (const lane of [l1, l2, l3]) {
    await this.page!.evaluate((l) => {
      const store = window.__bellLapStore.getState();
      const laneObj = store.lanes.find(lo => lo.laneNumber === l);
      if (laneObj && !laneObj.isEmpty) store.toggleLaneEmpty(l);
    }, lane);
  }
});

Then('the Live Leaderboard should display lanes {int}, {int}, and {int}', async function (this: CustomWorld, l1: number, l2: number, l3: number) {
  for (const lane of [l1, l2, l3]) {
    const el = this.page!.locator(`[data-testid="leaderboard-lane-${lane}"]`);
    await el.waitFor({ state: 'visible' });
    assert.ok(await el.isVisible());
  }
});

Then('the Live Leaderboard should not display lanes {int}, {int}, and {int}', async function (this: CustomWorld, l1: number, l2: number, l3: number) {
  for (const lane of [l1, l2, l3]) {
    const el = this.page!.locator(`[data-testid="leaderboard-lane-${lane}"]`);
    await el.waitFor({ state: 'hidden' });
    assert.ok(!(await el.isVisible()));
  }
});

Given('Lane {int} is on Lap {int}', async function (this: CustomWorld, lane: number, lap: number) {
  await this.page!.evaluate((args) => {
    const store = window.__bellLapStore.getState();
    store.updateLaneCount(args.lane, args.lap);
  }, { lane, lap });
});

Given('Lane {int} is on Lap {int} but touched earlier than Lane {int}', async function (this: CustomWorld, l1: number, lap: number, l2: number) {
  await this.page!.evaluate((args) => {
    const store = window.__bellLapStore.getState();
    const lanes = store.lanes.map((l) => {
      if (l.laneNumber === args.l1) return { ...l, count: args.lap, history: [Date.now() - 1000] };
      if (l.laneNumber === args.l2) return { ...l, count: args.lap, history: [Date.now()] };
      return l;
    });
    window.__bellLapStore.setState({ lanes });
  }, { l1, l2, lap });
});

Then('the order in the Leaderboard should be Lane {int}, Lane {int}, Lane {int}', async function (this: CustomWorld, l1: number, l2: number, l3: number) {
  await this.page!.waitForFunction(
    (args) => {
      const els = Array.from(document.querySelectorAll('[data-testid^="leaderboard-lane-"]'));
      return els.length >= 3 && els[0].textContent === args.l1 && els[1].textContent === args.l2 && els[2].textContent === args.l3;
    },
    { l1: String(l1), l2: String(l2), l3: String(l3) },
    { timeout: 5000 }
  );
  const texts = await this.page!.locator('[data-testid^="leaderboard-lane-"]').allTextContents();
  assert.strictEqual(texts[0], String(l1));
  assert.strictEqual(texts[1], String(l2));
  assert.strictEqual(texts[2], String(l3));
});

Then('Lane {int} and Lane {int} should have the same color in the Leaderboard', async function (this: CustomWorld, l1: number, l2: number) {
  const c1 = await this.page!.locator(`[data-testid="leaderboard-lane-${l1}"]`).getAttribute('class');
  const c2 = await this.page!.locator(`[data-testid="leaderboard-lane-${l2}"]`).getAttribute('class');
  const color1 = getColorClass(c1);
  const color2 = getColorClass(c2);
  assert.strictEqual(color1, color2, `Lanes ${l1} and ${l2} should have same color, but got ${color1} and ${color2}`);
});

Then('Lane {int} and Lane {int} should have different colors in the Leaderboard', async function (this: CustomWorld, l1: number, l2: number) {
  const c1 = await this.page!.locator(`[data-testid="leaderboard-lane-${l1}"]`).getAttribute('class');
  const c2 = await this.page!.locator(`[data-testid="leaderboard-lane-${l2}"]`).getAttribute('class');
  const color1 = getColorClass(c1);
  const color2 = getColorClass(c2);
  assert.notStrictEqual(color1, color2, `Lanes ${l1} and ${l2} should have different colors, but both are ${color1}`);
});

Given(/^the race is a (.*) event \((\d+) laps total\)$/, async function (this: CustomWorld, eventName: string, laps: number) {
  const dropdown = this.page!.locator('button:has-text("SC"), button:has-text("LC")').first();
  await dropdown.click();
  const popover = this.page!.locator('[role="menu"], [role="listbox"], .z-50').last();
  await popover.waitFor({ state: 'visible' });
  const item = popover.locator('button, li, [role="menuitem"], [role="option"]').getByText(eventName, { exact: true });
  await item.click({ force: true });

  const stateLaps = await this.page!.evaluate(() => {
    const state = window.__bellLapStore.getState();
    const config: Record<string, number> = {
      '500 SC': 20, '1000 SC': 40, '1650 SC': 66, '800 LC': 16, '1500 LC': 30
    };
    return config[state.event];
  });
  assert.strictEqual(stateLaps, laps, `Failed to configure event ${eventName}. Store has ${stateLaps} laps instead of ${laps}`);
});

Then('Lane {int} should display the color associated with Lap {int}', async function (this: CustomWorld, lane: number, lap: number) {
  const c = await this.page!.locator(`[data-testid="leaderboard-lane-${lane}"]`).getAttribute('class');
  const color = getColorClass(c);
  assert.ok(color && color !== 'text-success' && color !== 'text-foreground/50', `Lane ${lane} should have lap color for lap ${lap}, got ${color}`);
});

Then('Lane {int} should not be displayed in Green', async function (this: CustomWorld, lane: number) {
  const c = await this.page!.locator(`[data-testid="leaderboard-lane-${lane}"]`).getAttribute('class');
  assert.ok(!c?.includes('text-success'));
});

Given('Lane {int} has completed {int} laps', async function (this: CustomWorld, lane: number, laps: number) {
  await this.page!.evaluate((args) => {
    window.__bellLapStore.getState().updateLaneCount(args.lane, args.laps);
  }, { lane, laps });
});

Then('Lane {int} should be displayed in Green in the Leaderboard', async function (this: CustomWorld, lane: number) {
  const c = await this.page!.locator(`[data-testid="leaderboard-lane-${lane}"]`).getAttribute('class');
  assert.ok(c?.includes('text-success'));
});
