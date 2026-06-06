import { chromium } from 'playwright-core';

const BASE = 'https://openhumandesign.com';
const CHART = '/?d=1990-06-15&t=14:30&tz=-6&n=Noir';

const viewports = [
  { key: 'dark-desktop', width: 1440, height: 900 },
  { key: 'dark-mobile', width: 390, height: 844 },
];

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});

for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
  });
  // pre-seed dark theme so first paint is dark
  await ctx.addInitScript(() => {
    try { localStorage.setItem('bodygraph-theme', 'dark'); } catch (e) {}
  });
  const page = await ctx.newPage();
  const dir = `/tmp/ui-audit/${vp.key}`;

  const go = async (url) => {
    await page.goto(BASE + url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
  };
  const shot = async (name, full = true) => {
    await page.screenshot({ path: `${dir}/${name}.png`, fullPage: full });
    console.log(`  ${vp.key}/${name}.png`);
  };

  console.log(`\n=== ${vp.key} ===`);

  // Entry page (no params)
  await go('/');
  // verify theme attribute
  const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log(`  data-theme=${theme}`);
  await shot('00-entry');

  // Chart view
  await go(CHART);
  await shot('01-chart');

  // Tabs
  const tabs = ['centers', 'channels', 'gates', 'planets', 'variable', 'cross'];
  for (const t of tabs) {
    const sel = `.panel-tab[data-panel="${t}"]`;
    const tab = await page.$(sel);
    if (tab) {
      await tab.click();
      await page.waitForTimeout(500);
      await shot(`02-tab-${t}`);
    } else {
      console.log(`  MISSING TAB: ${t}`);
    }
  }

  // Transits
  await go(CHART + '&view=transits');
  await shot('03-transits');

  // Connection
  await go(CHART + '&view=connection');
  await shot('04-connection');

  // Team
  await go(CHART + '&view=team');
  await shot('05-team');

  await ctx.close();
}

await browser.close();
console.log('\ndone');
