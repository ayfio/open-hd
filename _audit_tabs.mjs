import { chromium } from 'playwright-core';
const OUT = '/tmp/ui-audit/hd-student';
const URL = 'https://openhumandesign.com/?d=1990-06-15&t=14:30&tz=-6&n=Study';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

async function tab(name) {
  await page.locator(`.panel-tab[data-panel="${name}"]`).click();
  await page.waitForTimeout(400);
  const txt = await page.locator('#panel-content').innerText().catch(()=>'(none)');
  console.log(`\n===== TAB: ${name} =====\n` + txt);
}
// list tabs available
const tabs = await page.locator('.panel-tab').allInnerTexts();
console.log('PANEL TABS: ' + JSON.stringify(tabs));

for (const t of ['centers','channels','gates','planets','variable','cross']) {
  await tab(t);
}

// Screenshot planets tab (substructure) — scroll panel into view
await page.locator('.panel-tab[data-panel="planets"]').click();
await page.waitForTimeout(400);
await page.locator('#panel-content').scrollIntoViewIfNeeded();
await page.screenshot({ path: `${OUT}/06-planets-tab.png` });

// Hover a planet cell to see substructure tooltip (title attr) -> read title
const cell = page.locator('.planet-cell.act-design[data-gate]').first();
const title = await cell.getAttribute('title');
console.log('\nPLANET CELL substructure title: "' + title + '"');

// Variable tab screenshot
await page.locator('.panel-tab[data-panel="variable"]').click();
await page.waitForTimeout(400);
await page.locator('#panel-content').scrollIntoViewIfNeeded();
await page.screenshot({ path: `${OUT}/07-variable-tab.png`, fullPage: true });

// Cross tab screenshot
await page.locator('.panel-tab[data-panel="cross"]').click();
await page.waitForTimeout(400);
await page.locator('#panel-content').scrollIntoViewIfNeeded();
await page.screenshot({ path: `${OUT}/08-cross-tab.png`, fullPage: true });

// Channels tab screenshot (hanging gates)
await page.locator('.panel-tab[data-panel="channels"]').click();
await page.waitForTimeout(400);
await page.locator('#panel-content').scrollIntoViewIfNeeded();
await page.screenshot({ path: `${OUT}/09-channels-tab.png`, fullPage: true });

await browser.close();
