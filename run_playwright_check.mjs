import { chromium } from 'playwright-core';
import path from 'path';

const chromePath = '/usr/bin/google-chrome';
const dist = path.join(process.cwd(), 'dist', 'index.html');
const url = 'file://' + dist;

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

await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);

const bodyText = (await page.locator('body').innerText().catch(() => ''))
  .split('\n')
  .slice(0, 30)
  .join('\n');

await page.screenshot({ path: 'playwright_initial.png', fullPage: true });

const buttonCount = await page.getByRole('button', { name: /take a breath/i }).count();

console.log(
  JSON.stringify(
    {
      url,
      buttonCount,
      pageErrors,
      consoleMessages,
      bodyText,
    },
    null,
    2
  )
);

await browser.close();
