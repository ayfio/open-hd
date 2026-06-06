import { chromium } from 'playwright-core';

const OUT = '/tmp/ui-audit/account-journey';
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true
});
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

const logs = [];
page.on('console', m => logs.push(`[console.${m.type()}] ${m.text()}`));
page.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));

// 1) Create a chart with a name via instant URL params
await page.goto('http://localhost:8788/?d=1990-06-15&t=14:30&tz=-6&n=Audit%20Tester', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/01-chart-loaded.png` });

// Is the Sync button visible?
const syncBtn = page.locator('#sync-button');
const syncVisible = await syncBtn.isVisible();
const syncText = await syncBtn.textContent().catch(() => null);
console.log('SYNC_BUTTON_VISIBLE', syncVisible, JSON.stringify(syncText));

// 2) Open the Sync popover
await syncBtn.click();
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/02-sync-popover-open.png` });

// Capture the popover copy verbatim
const popoverText = await page.locator('#sync-popover').innerText();
console.log('POPOVER_TEXT_START');
console.log(popoverText);
console.log('POPOVER_TEXT_END');

// Tight screenshot of just the popover
const pop = await page.locator('#sync-popover').boundingBox();
if (pop) {
  await page.screenshot({ path: `${OUT}/02b-popover-clip.png`, clip: { x: Math.max(0,pop.x-8), y: Math.max(0,pop.y-8), width: pop.width+16, height: pop.height+16 } });
}

// 3) Submit email
await page.fill('#sync-email', 'test-audit@example.com');
await page.screenshot({ path: `${OUT}/03-email-filled.png` });
await page.click('#sync-form button[type="submit"]');
await page.waitForTimeout(2500);
const status = await page.locator('#sync-status').innerText();
console.log('STATUS_AFTER_SUBMIT', JSON.stringify(status));
const pop2 = await page.locator('#sync-popover').boundingBox();
if (pop2) {
  await page.screenshot({ path: `${OUT}/04-after-submit-clip.png`, clip: { x: Math.max(0,pop2.x-8), y: Math.max(0,pop2.y-8), width: pop2.width+16, height: pop2.height+16 } });
}

console.log('--- BROWSER LOGS ---');
console.log(logs.join('\n'));

// Save cookies so later stages can reuse same context if needed
await ctx.storageState({ path: `${OUT}/state-prelogin.json` });
await browser.close();
