import { chromium } from 'playwright-core';
const OUT = '/tmp/ui-audit/hd-student';
const URL = 'https://openhumandesign.com/?d=1990-06-15&t=14:30&tz=-6&n=Study';

const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const logs = [];
page.on('console', m => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));

await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

// Banner + foundation
await page.screenshot({ path: `${OUT}/01-loaded-top.png` });

// Full page
await page.screenshot({ path: `${OUT}/02-full.png`, fullPage: true });

// Dump the type banner + foundation text
const banner = await page.locator('#type-banner').innerText().catch(()=>'(none)');
const foundation = await page.locator('#foundation-panel').innerText().catch(()=>'(none)');
console.log('=== BANNER ===\n' + banner);
console.log('=== FOUNDATION ===\n' + foundation);

// Planet columns present?
const designCol = await page.locator('.bg-planets-design').innerText().catch(()=>'(none)');
const persCol = await page.locator('.bg-planets-personality').innerText().catch(()=>'(none)');
console.log('=== DESIGN COL ===\n' + designCol);
console.log('=== PERSONALITY COL ===\n' + persCol);

console.log('=== CONSOLE LOGS ===\n' + logs.join('\n'));
await browser.close();
