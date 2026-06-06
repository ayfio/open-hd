import { chromium } from 'playwright-core';

const BASE = 'https://openhumandesign.com';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const browser = await chromium.launch({ executablePath: CHROME, headless: true });

async function snap(key, url, { width=1280, height=900, dark=false, actions=null, full=true } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type()==='error') errors.push('CONSOLE: '+m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: '+e.message));
  if (dark) {
    await page.addInitScript(() => localStorage.setItem('bodygraph-theme','dark'));
  }
  await page.goto(BASE + url, { waitUntil: 'networkidle' }).catch(e=>errors.push('GOTO: '+e.message));
  await page.waitForTimeout(900);
  let extra = {};
  if (actions) extra = await actions(page) || {};
  const dir = `/tmp/ui-audit/${key}`;
  await page.screenshot({ path: `${dir}.png`, fullPage: full }).catch(()=>{});
  await ctx.close();
  return { errors, extra };
}

const results = {};

// ---- 1. Reflector desktop ----
results.reflector_desktop = await snap('1-reflector-desktop', '/?d=1985-11-17&t=06:00&tz=0&n=Reflector', {
  actions: async (page) => {
    const banner = await page.locator('#type-banner').innerText().catch(()=>'(none)');
    // Foundation values
    const foundation = await page.locator('#foundation-panel').innerText().catch(()=>'(none)');
    // visit each tab
    const tabReport = {};
    for (const t of ['centers','channels','gates','planets','variable','cross']) {
      await page.locator(`.panel-tab[data-panel="${t}"]`).click();
      await page.waitForTimeout(250);
      tabReport[t] = (await page.locator('#panel-content').innerText().catch(()=>'(err)')).slice(0,400);
    }
    return { banner, foundation, tabReport };
  }
});

console.log('=== 1. REFLECTOR DESKTOP ===');
console.log('errors:', results.reflector_desktop.errors);
console.log('BANNER:\n', results.reflector_desktop.extra.banner);
console.log('FOUNDATION:\n', results.reflector_desktop.extra.foundation);
for (const [t,v] of Object.entries(results.reflector_desktop.extra.tabReport)) {
  console.log(`--- TAB ${t} ---\n`, v, '\n');
}

await browser.close();
