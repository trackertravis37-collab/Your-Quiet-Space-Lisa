import { chromium } from 'playwright-core';

const chromePath = '/usr/bin/google-chrome';
const url = 'http://localhost:5174/#/landing';

const browser = await chromium.launch({
  headless: true,
  executablePath: chromePath,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage();

const consoleMessages = [];
const pageErrors = [];
page.on('console', (msg) => consoleMessages.push({ type: msg.type(), text: msg.text() }));
page.on('pageerror', (err) => pageErrors.push(String(err)));

await page.goto(url, { waitUntil: 'networkidle' });

await page.getByRole('button', { name: /take a breath/i }).click({ timeout: 10000 });
await page.waitForTimeout(800);

const hasErrorBoundary = (await page.getByRole('heading', { name: /something went wrong/i }).count()) > 0;

await page.screenshot({ path: 'playwright_after_click.png', fullPage: true });

console.log(JSON.stringify({ url, hasErrorBoundary, pageErrors, consoleMessages }, null, 2));

await browser.close();
