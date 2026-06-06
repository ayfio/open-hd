import { chromium } from 'playwright-core';
const BASE = 'https://openhumandesign.com';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ executablePath: CHROME, headless: true });

async function run(key, url, { width=1280, height=900, dark=false, actions=null } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type()==='error') errors.push('CONSOLE: '+m.text().slice(0,200)); });
  page.on('pageerror', e => errors.push('PAGEERROR: '+e.message.slice(0,200)));
  if (dark) await page.addInitScript(() => localStorage.setItem('bodygraph-theme','dark'));
  await page.goto(BASE + url, { waitUntil: 'networkidle' }).catch(e=>errors.push('GOTO: '+e.message));
  await page.waitForTimeout(900);
  let extra = {};
  if (actions) extra = await actions(page) || {};
  await ctx.close();
  return { errors, extra };
}

// ---- 2. Time-unknown ----
const tu = await run('2-timeunknown', '/?d=1990-06-15&tz=-6&n=NoTime&tu=1', {
  actions: async (page) => {
    await page.screenshot({ path: '/tmp/ui-audit/2-timeunknown-banner.png' });
    const banner = await page.locator('#type-banner').innerText().catch(()=>'(none)');
    const foundationHasReliability = await page.locator('#foundation-panel .reliability').count();
    // planets tab
    await page.locator('.panel-tab[data-panel="planets"]').click();
    await page.waitForTimeout(250);
    const planets = (await page.locator('#panel-content').innerText().catch(()=>'')).slice(0,500);
    await page.screenshot({ path: '/tmp/ui-audit/2-timeunknown-planets.png' });
    return { banner, foundationHasReliability, planets };
  }
});
console.log('=== 2. TIME-UNKNOWN ===');
console.log('errors:', tu.errors);
console.log('BANNER:\n', tu.extra.banner);
console.log('reliability blocks in foundation (should be 0):', tu.extra.foundationHasReliability);
console.log('PLANETS TAB:\n', tu.extra.planets);

// ---- 3a. Malformed: d=junk ----
const junk = await run('3a-djunk', '/?d=junk', {
  actions: async (page) => {
    const entryVisible = !(await page.locator('#birth-entry').evaluate(el=>el.classList.contains('hidden')).catch(()=>true));
    const chartVisible = !(await page.locator('#chart-view').evaluate(el=>el.classList.contains('hidden')).catch(()=>true));
    await page.screenshot({ path: '/tmp/ui-audit/3a-djunk.png' });
    return { entryVisible, chartVisible };
  }
});
console.log('\n=== 3a. d=junk ===');
console.log('errors:', junk.errors);
console.log('entry form visible:', junk.extra.entryVisible, '| chart visible:', junk.extra.chartVisible);

// ---- 3b. Malformed: d=2090-13-45 (passes regex, impossible date) ----
const baddate = await run('3b-baddate', '/?d=2090-13-45&tz=0&n=BadDate', {
  actions: async (page) => {
    const entryVisible = !(await page.locator('#birth-entry').evaluate(el=>el.classList.contains('hidden')).catch(()=>true));
    const chartVisible = !(await page.locator('#chart-view').evaluate(el=>el.classList.contains('hidden')).catch(()=>true));
    const banner = await page.locator('#type-banner').innerText().catch(()=>'(none / not rendered)');
    await page.screenshot({ path: '/tmp/ui-audit/3b-baddate.png', fullPage: true });
    return { entryVisible, chartVisible, banner };
  }
});
console.log('\n=== 3b. d=2090-13-45 ===');
console.log('errors:', baddate.errors);
console.log('entry visible:', baddate.extra.entryVisible, '| chart visible:', baddate.extra.chartVisible);
console.log('BANNER:\n', baddate.extra.banner);

await browser.close();
