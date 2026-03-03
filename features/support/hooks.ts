import { Before, After, BeforeAll, AfterAll, setDefaultTimeout, ITestCaseHookParameter } from '@cucumber/cucumber';
import { chromium, Browser } from 'playwright';
import { CustomWorld } from './world';
import { join } from 'node:path';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

// Increase timeout for E2E tests
setDefaultTimeout(30 * 1000);

let globalBrowser: Browser | undefined;
const COVERAGE_DIR = join(process.cwd(), 'test-results', 'coverage');

BeforeAll(async function () {
  if (!existsSync(COVERAGE_DIR)) {
    mkdirSync(COVERAGE_DIR, { recursive: true });
  }
});

Before({ tags: '@browser' }, async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  if (!globalBrowser) {
    globalBrowser = await chromium.launch({
      headless: true,
      args: [
        '--use-gl=egl',
        '--ignore-gpu-blocklist',
        '--no-sandbox',
        '--disable-web-security',
      ],
    });
  }

  // We still provide the browser to the world for convenience,
  // though we don't close it in After.
  this.browser = globalBrowser;
  this.scenarioName = scenario.pickle.name;

  this.context = await this.browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  // Aggressive WebGL and other mocks
  await this.context.addInitScript(() => {
    // WebGL constants
    const glConstants: Record<string, number> = {
      VERTEX_SHADER: 35633,
      FRAGMENT_SHADER: 35632,
      HIGH_FLOAT: 36338,
      MEDIUM_FLOAT: 36337,
      LOW_FLOAT: 36336,
      MAX_TEXTURE_IMAGE_UNITS: 35661,
      MAX_VERTEX_TEXTURE_IMAGE_UNITS: 35660,
      MAX_TEXTURE_SIZE: 3379,
      MAX_CUBE_MAP_TEXTURE_SIZE: 34076,
      MAX_VERTEX_ATTRIBS: 34921,
      MAX_VERTEX_UNIFORM_VECTORS: 36347,
      MAX_VARYING_VECTORS: 36348,
      MAX_FRAGMENT_UNIFORM_VECTORS: 36349,
      MAX_SAMPLES: 36183,
      SAMPLES: 32937,
      MAX_COMBINED_TEXTURE_IMAGE_UNITS: 35661,
      VERSION: 7938,
      VENDOR: 7936,
      RENDERER: 7937,
      SHADING_LANGUAGE_VERSION: 35724,
      UNMASKED_VENDOR_WEBGL: 0x9245,
      UNMASKED_RENDERER_WEBGL: 0x9246,
    };

    const mockContext = {
      canvas: document.createElement('canvas'),
      getParameter: (param: number) => {
        if (param === 0x1f00 || param === 0x9245) return 'WebGL Mock';
        if (param === 0x1f01 || param === 0x9246) return 'Mock Renderer';
        if (param === 0x8df8) return 1024;
        return glConstants[param] || 0;
      },
      getExtension: () => null,
      getShaderPrecisionFormat: () => ({ precision: 1, rangeMin: 1, rangeMax: 1 }),
      createProgram: () => ({}),
      createShader: () => ({}),
      shaderSource: () => {},
      compileShader: () => {},
      getShaderParameter: () => true,
      getProgramParameter: () => true,
      getAttribLocation: () => 0,
      getUniformLocation: () => ({}),
      linkProgram: () => {},
      useProgram: () => {},
      enableVertexAttribArray: () => {},
      vertexAttribPointer: () => {},
      drawArrays: () => {},
      viewport: () => {},
      clear: () => {},
      clearColor: () => {},
      createBuffer: () => ({}),
      bindBuffer: () => {},
      bufferData: () => {},
      createTexture: () => ({}),
      bindTexture: () => {},
      texImage2D: () => {},
      texParameteri: () => {},
      activeTexture: () => {},
      getError: () => 0,
      flush: () => {},
      finish: () => {},
      getSupportedExtensions: () => [],
      getContextAttributes: () => ({ antialias: true, alpha: true }),
      ...glConstants
    };

    (window as unknown as { WebGLRenderingContext: unknown }).WebGLRenderingContext = class {};
    (window as unknown as { WebGL2RenderingContext: unknown }).WebGL2RenderingContext = class {};

    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    (HTMLCanvasElement.prototype as unknown as { getContext: unknown }).getContext = function(this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
        (mockContext as unknown as { canvas: HTMLCanvasElement }).canvas = this;
        return mockContext;
      }
      return (originalGetContext as (...args: unknown[]) => unknown).apply(this, [type, ...args]);
    };

    // Mock navigator.vibrate
    (window as unknown as { __VIBRATE_CALLS__: unknown[] }).__VIBRATE_CALLS__ = [];
    Object.defineProperty(window.navigator, 'vibrate', {
      value: (pattern: number | number[]) => {
        (window as unknown as { __VIBRATE_CALLS__: unknown[] }).__VIBRATE_CALLS__.push(pattern);
        return true;
      },
      configurable: true,
      writable: true
    });
  });

  this.page = await this.context.newPage();
  this.page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning' || msg.type() === 'log') {
        console.log(`[BROWSER ${msg.type().toUpperCase()}] ${msg.text()}`);
    }
  });
  await this.page.clock.install();

  // Start coverage collection
  await this.page.coverage.startJSCoverage();
});

After({ tags: '@browser' }, async function (this: CustomWorld, scenario) {
  if (this.page) {
    const coverage = await this.page.coverage.stopJSCoverage();
    const scenarioName = scenario.pickle.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    writeFileSync(
      join(COVERAGE_DIR, `coverage-${scenarioName}-${Date.now()}.json`),
      JSON.stringify(coverage)
    );
    await this.page.close();
  }
  await this.context?.close();
  // We do NOT close the browser here as it's shared across scenarios.
});

AfterAll(async function () {
  if (globalBrowser) {
    await globalBrowser.close();
    globalBrowser = undefined;
  }
});
