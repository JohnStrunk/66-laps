import { chromium } from '@playwright/test';

async function run() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const pages = [
        '/',
        '/counting',
        '/sheets',
        '/practice',
        '/app'
    ];

    await page.addInitScript(() => {
        const originalWarn = console.warn;
        console.warn = function(...args) {
            const err = new Error();
            originalWarn.apply(console, [...args, '\nStack trace:', err.stack]);
        };
    });

    page.on('console', msg => {
        const type = msg.type();
        if (type === 'error' || type === 'warning' || type === 'log') {
            const loc = msg.location();
            console.log(`[browser-${type}] ${msg.text()} (${loc.url}:${loc.lineNumber}:${loc.columnNumber})`);
        }
    });

    page.on('pageerror', err => {
        console.log(`[browser-pageerror] ${err.message}`);
    });

    for (const route of pages) {
        console.log(`\n=== Visiting http://127.0.0.1:3000${route} ===`);
        try {
            await page.goto(`http://127.0.0.1:3000${route}`, { waitUntil: 'load', timeout: 5000 });
            // Wait a moment for any lazy-loaded elements/effects to run
            await page.waitForTimeout(1000);

            if (route === '/practice') {
                console.log('Interacting with settings dropdowns to test listbox rendering...');
                const triggers = await page.locator('[data-testid^="settings-"]').all();
                for (const trigger of triggers) {
                    try {
                        await trigger.click({ force: true, timeout: 1000 });
                        await page.waitForTimeout(200);
                        await page.keyboard.press('Escape');
                        await page.waitForTimeout(200);
                    } catch {
                        // ignore if click fails on non-interactive/hidden elements
                    }
                }
            }
        } catch (e) {
            console.error(`Failed to visit ${route}: ${e.message}`);
        }
    }

    await browser.close();
}

run().catch(console.error);
