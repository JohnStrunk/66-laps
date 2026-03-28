import { Before, After, BeforeAll, AfterAll, setDefaultTimeout, ITestCaseHookParameter } from '@cucumber/cucumber';
import { chromium, Browser } from 'playwright';
import { CustomWorld } from './world';
import { join } from 'node:path';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

// Set default timeout to 60 seconds
setDefaultTimeout(60000);

let globalBrowser: Browser | undefined;

BeforeAll(async function () {
  globalBrowser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
});

let sharedContext: import('playwright').BrowserContext | undefined;
let sharedPage: import('playwright').Page | undefined;

Before(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  this.scenarioName = scenario.pickle.name;

  if (!sharedContext || !sharedPage) {
    sharedContext = await globalBrowser!.newContext({
      viewport: { width: 1280, height: 720 },
      permissions: ['notifications'],
    });
    sharedPage = await sharedContext.newPage();
  } else {
    // Some components like HeroUI modals and overlays do not reliably unmount when state is changed
    // rapidly under a fake timer. It's safer to reload the page to get a completely clean DOM.
    // We clear storage first.
    await sharedPage.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    }).catch(() => {});

    // We navigate to about:blank to fully detach everything, then the specific step
    // (e.g. "the app is loaded") will navigate to the proper URL.
    await sharedPage.goto('about:blank').catch(()=>{});
  }

  this.context = sharedContext;
  this.page = sharedPage;

  // Coverage and clock only need to be started once if we reuse the page
  if (!(sharedPage as unknown as { __initialized?: boolean }).__initialized) {
    await this.page.coverage.startJSCoverage().catch(() => {});
    await this.page.clock.install().catch(() => {});
    (sharedPage as unknown as { __initialized?: boolean }).__initialized = true;
  }
});

After(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  // Stop coverage and save it ONLY on failure or if we want to change this behavior later,
  // For now, doing it per scenario with shared pages resets the coverage.
  // We'll leave it running and not stop it, saving it in AfterAll instead to speed up tests.
  // Or, since coverage isn't fully set up in these tests anyway, we just ignore stopping it per scenario.
  if (this.page && process.env.COVERAGE === 'true') {
     // intentionally left empty
  }

  if (scenario.result?.status === 'FAILED') {
    const screenshotDir = join(process.cwd(), 'test-results', 'screenshots');
    if (!existsSync(screenshotDir)) {
      mkdirSync(screenshotDir, { recursive: true });
    }
    const screenshotPath = join(screenshotDir, `${scenario.pickle.name.replace(/\s+/g, '_')}.png`);
    const screenshot = await this.page?.screenshot({ path: screenshotPath });
    if (screenshot) {
      this.attach(screenshot, 'image/png');
    }
  }
  // We do NOT close the context/page here as it's shared across scenarios for performance.
});

AfterAll(async function () {
  // Stop coverage and save it
  if (sharedPage) {
    try {
      const coverage = await sharedPage.coverage.stopJSCoverage();
      const coverageDir = join(process.cwd(), 'test-results', 'coverage');
      if (!existsSync(coverageDir)) {
        mkdirSync(coverageDir, { recursive: true });
      }
      const timestamp = new Date().getTime();
      writeFileSync(
        join(coverageDir, `coverage-shared-${timestamp}.json`),
        JSON.stringify(coverage)
      );
    } catch {}
  }

  if (sharedContext) {
    await sharedContext.close();
    sharedContext = undefined;
    sharedPage = undefined;
  }
  if (globalBrowser) {
    await globalBrowser.close();
    globalBrowser = undefined;
  }
});
