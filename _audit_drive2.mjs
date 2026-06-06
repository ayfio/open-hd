import { chromium } from 'playwright-core';
const OUT = '/tmp/ui-audit/hd-student';
const URL = 'https://openhumandesign.com/?d=1990-06-15&t=14:30&tz=-6&n=Study';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

// Hover a planet row in the design column (gate 36.5 = Sun) -> should highlight gate
const row = page.locator('.bg-planets-design .bg-planet-row').nth(2); // skip head/date -> actually rows start after head+date
// Hover over the gate circle 36 directly in svg
const gate36 = page.locator('.bg-gate[data-gate="36"]');
await gate36.hover();
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/03-hover-gate36.png` });
// check dimmed class
const dimmed = await page.locator('.bodygraph-svg.bg-dimmed').count();
const lit = await page.locator('.bg-lit').count();
console.log('hover gate36: dimmed=' + dimmed + ' lit=' + lit);

// tooltip text
const tt = await page.locator('.bg-tooltip').innerText().catch(()=>'(none)');
console.log('tooltip: ' + tt.replace(/\n/g,' | '));

// Hover a planet COLUMN row to test highlight from column
await page.mouse.move(10,10);
await page.waitForTimeout(300);
const drow = page.locator('.bg-planets-design .bg-planet-row[data-gate]').first();
await drow.hover();
await page.waitForTimeout(400);
const dimmed2 = await page.locator('.bodygraph-svg.bg-dimmed').count();
console.log('hover design column row: svg dimmed=' + dimmed2);
await page.screenshot({ path: `${OUT}/04-hover-col-row.png` });

// Click gate 12 (Sun personality, in a channel?) 
await page.mouse.move(10,10);
await page.locator('.bg-gate[data-gate="12"]').click();
await page.waitForTimeout(500);
await page.locator('#gate-detail').scrollIntoViewIfNeeded();
const gd12 = await page.locator('#gate-detail').innerText().catch(()=>'(none)');
console.log('=== GATE 12 DETAIL ===\n' + gd12);
await page.screenshot({ path: `${OUT}/05-gate12-detail.png` });

await browser.close();
