/**
 * End-to-end smoke test — drives system Chrome against a running dev server.
 *
 *   npm run dev          # in one terminal (or any port via E2E_URL)
 *   npm run e2e          # in another
 *
 * Exercises the real flows: birth entry with place autocomplete (live
 * Open-Meteo call), chart render, gate click → detail, tabs, saving a
 * person, people switcher, connection compare, theme toggle.
 */

import { chromium } from 'playwright-core';

const BASE = process.env.E2E_URL || 'http://localhost:5174';
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

let failures = 0;
const ok = (name) => console.log(`✔ ${name}`);
const fail = (name, err) => { failures++; console.error(`✖ ${name}\n  ${err}`); };

async function check(name, fn) {
  try { await fn(); ok(name); } catch (err) { fail(name, err.message || err); }
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1380, height: 1000 } });
page.on('pageerror', err => fail('page JS error', err.message));

// --- Entry flow with live geocoding ---
await page.goto(BASE);

await check('entry form renders', async () => {
  await page.waitForSelector('#birth-form', { timeout: 5000 });
});

await check('place autocomplete returns results (Open-Meteo)', async () => {
  await page.fill('#birth-name', 'E2E Person');
  await page.fill('#birth-date', '1990-06-15');
  await page.fill('#birth-time', '14:30');
  await page.fill('#birth-place', 'Boulder');
  await page.waitForSelector('.place-result', { timeout: 8000 });
});

await check('selecting a place resolves historical timezone', async () => {
  await page.click('.place-result:first-child');
  const chip = await page.waitForSelector('#tz-chip:not(.hidden)', { timeout: 3000 });
  const text = await chip.textContent();
  if (!/UTC-6/.test(text)) throw new Error(`expected UTC-6 (MDT June 1990), got: ${text}`);
  if (!/America\/Denver/.test(text)) throw new Error(`expected America/Denver, got: ${text}`);
});

await check('chart renders after submit', async () => {
  await page.click('#birth-form button[type=submit]');
  await page.waitForSelector('#chart-view:not(.hidden)', { timeout: 5000 });
  await page.waitForSelector('.bodygraph-svg', { timeout: 3000 });
});

await check('type banner shows plain-language type', async () => {
  const banner = await page.textContent('#type-banner');
  if (!/Generator|Manifestor|Projector|Reflector/.test(banner)) throw new Error(banner.slice(0, 120));
});

await check('planet columns show 26 activations', async () => {
  const rows = await page.$$eval('.bg-planet-row', els =>
    els.filter(e => e.querySelector('.bg-planet-act')?.textContent !== '—').length);
  if (rows !== 26) throw new Error(`got ${rows} rows`);
});

await check('clicking a gate opens detail card', async () => {
  await page.click('.bg-gate[data-gate="34"]');
  await page.waitForSelector('#gate-detail:not(.hidden)', { timeout: 3000 });
  const detail = await page.textContent('#gate-detail');
  if (!/Gate 34/.test(detail)) throw new Error(detail.slice(0, 120));
});

await check('panel tabs switch content', async () => {
  for (const tab of ['planets', 'variable', 'cross', 'channels', 'gates', 'centers']) {
    await page.click(`.panel-tab[data-panel="${tab}"]`);
    const content = await page.textContent('#panel-content');
    if (content.trim().length < 50) throw new Error(`${tab} tab looks empty`);
  }
});

await check('person was saved and appears in switcher', async () => {
  const options = await page.$$eval('#people-switcher option', els => els.map(e => e.textContent));
  if (!options.some(o => o.includes('E2E Person'))) throw new Error(`options: ${options.join(', ')}`);
});

await check('share URL contains birth data', async () => {
  const url = page.url();
  if (!/d=1990-06-15/.test(url) || !/t=14%3A30|t=14:30/.test(url)) throw new Error(url);
});

// --- Transits ---
await check('transits view renders with overlay graph', async () => {
  await page.click('.nav-link[data-view="transits"]');
  await page.waitForSelector('#transits-view:not(.hidden)', { timeout: 3000 });
  await page.waitForSelector('#transit-bodygraph .bodygraph-svg', { timeout: 3000 });
  const content = await page.textContent('#transit-content');
  if (!/Transit Sun/.test(content)) throw new Error(content.slice(0, 120));
});

// --- Connection with manual person ---
// Shared place-search helper (Connection / Team): type → pick first result.
async function pickPlace(scope, query) {
  await page.fill(`${scope} .ps-input`, query);
  await page.waitForSelector(`${scope} .ps-result`, { timeout: 8000 });
  await page.click(`${scope} .ps-result`);
  await page.waitForSelector(`${scope} .ps-chip`, { timeout: 5000 }); // offset resolved
}

await check('connection compare works (place search resolves tz)', async () => {
  await page.click('.nav-link[data-view="connection"]');
  await page.fill('#conn-name', 'Partner');
  await page.fill('#conn-date', '1985-03-20');
  await page.fill('#conn-time', '08:00');
  await pickPlace('#conn-place', 'London');
  await page.click('#conn-calculate');
  await page.waitForSelector('#connection-content .foundation-item', { timeout: 5000 });
  const content = await page.textContent('#connection-content');
  if (!/Composite Type/.test(content)) throw new Error(content.slice(0, 120));
});

// --- Team using manual rows with place search ---
await check('team analysis works (place search per row)', async () => {
  await page.click('.nav-link[data-view="team"]');
  await page.click('#add-member'); // one row exists from init; now two
  const rows = [
    { date: '1992-11-02', place: 'Tokyo' },
    { date: '1985-03-20', place: 'Paris' },
  ];
  for (let i = 0; i < rows.length; i++) {
    const sel = `#team-members .team-member-row:nth-child(${i + 1})`;
    await page.fill(`${sel} .team-date`, rows[i].date);
    await pickPlace(`${sel} .team-place`, rows[i].place);
  }
  await page.click('#team-calculate');
  await page.waitForSelector('#team-content .role-card', { timeout: 5000 });
});

// --- Theme toggle re-renders graph ---
await check('theme toggle flips palette and re-renders bodygraph', async () => {
  await page.click('.nav-link[data-view="chart"]');
  await page.click('#theme-toggle');
  const theme = await page.getAttribute('html', 'data-theme');
  if (theme !== 'dark') throw new Error(`theme: ${theme}`);
  await page.waitForSelector('.bodygraph-svg', { timeout: 3000 });
});

// --- Reload restores last person ---
await check('reload auto-restores last chart', async () => {
  await page.goto(BASE);
  await page.waitForSelector('#chart-view:not(.hidden)', { timeout: 5000 });
  const banner = await page.textContent('#type-banner');
  if (!/E2E Person/.test(banner)) throw new Error(banner.slice(0, 120));
});

// --- P1-7: edit name + AI access through the switcher modal ---
await check('edit person renames in place (P1-7)', async () => {
  await page.selectOption('#people-switcher', '__edit');
  await page.waitForSelector('.modal #edit-name', { timeout: 3000 });
  await page.fill('.modal #edit-name', 'Renamed Person');
  await page.click('.modal #edit-save');
  await page.waitForSelector('.modal', { state: 'detached', timeout: 3000 });
  const banner = await page.textContent('#type-banner');
  if (!/Renamed Person/.test(banner)) throw new Error('rename not reflected: ' + banner.slice(0, 120));
});

// --- P1-11: a shared chart stays comparable after "make your own" ---
await check('shared person retained for comparison (P1-11)', async () => {
  const ctx = await browser.newContext();
  const p2 = await ctx.newPage();
  p2.on('pageerror', err => fail('P1-11 page JS error', err.message));
  await p2.goto(`${BASE}?d=1980-05-10&t=09:00&tz=2&n=GuestPal`);
  await p2.click('#make-own', { timeout: 5000 });
  await p2.fill('#birth-name', 'Me');
  await p2.fill('#birth-date', '1990-06-15');
  await p2.fill('#birth-time', '14:30');
  await p2.fill('#birth-place', 'Boulder');
  await p2.waitForSelector('.place-result', { timeout: 8000 });
  await p2.click('.place-result:first-child');
  await p2.click('#birth-form button[type=submit]');
  await p2.waitForSelector('#chart-view:not(.hidden)', { timeout: 5000 });
  await p2.click('.nav-link[data-view="connection"]');
  const opts = await p2.textContent('#conn-person');
  if (!/GuestPal/.test(opts)) throw new Error('shared guest not retained in picker: ' + opts);
  await ctx.close();
});

await browser.close();

console.log(failures ? `\n${failures} FAILED` : '\nAll e2e checks passed');
process.exit(failures ? 1 : 0);
