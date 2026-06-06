import { chromium } from 'playwright-core';
import fs from 'fs';

const OUT = '/tmp/ui-audit/account-journey';
const VERIFY_URL = process.env.VERIFY_URL;
if (!VERIFY_URL) { console.error('set VERIFY_URL'); process.exit(1); }

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true
});
// Use the SAME storage state as stage1 so we have the localStorage chart + any cookies
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  storageState: `${OUT}/state-prelogin.json`
});
const page = await ctx.newPage();
const logs = [];
page.on('console', m => logs.push(`[console.${m.type()}] ${m.text()}`));
page.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));

// 4) Open the interstitial
await page.goto(VERIFY_URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/05-interstitial.png`, fullPage: true });
const interTitle = await page.title();
const interBody = await page.locator('body').innerText();
console.log('INTERSTITIAL_TITLE', JSON.stringify(interTitle));
console.log('INTERSTITIAL_BODY_START');
console.log(interBody);
console.log('INTERSTITIAL_BODY_END');

// 5) Click through the "Sign in" button/link
const link = page.locator('a:has-text("Sign in to Open Human Design")');
const linkExists = await link.count();
console.log('SIGNIN_LINK_COUNT', linkExists);
await Promise.all([
  page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {}),
  link.first().click()
]);
await page.waitForTimeout(1500);
console.log('LANDED_URL', page.url());
await page.screenshot({ path: `${OUT}/06-after-verify-landing.png`, fullPage: true });

// 6) Verify signed-in state — check the sync button text
const syncBtnText = await page.locator('#sync-button').textContent().catch(() => null);
const syncBtnTitle = await page.locator('#sync-button').getAttribute('title').catch(() => null);
console.log('SYNC_BTN_AFTER_LOGIN', JSON.stringify(syncBtnText), 'TITLE', JSON.stringify(syncBtnTitle));

// 7) Open the account panel
await page.locator('#sync-button').click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/07-account-panel.png` });
const accountText = await page.locator('#sync-popover').innerText();
console.log('ACCOUNT_PANEL_START');
console.log(accountText);
console.log('ACCOUNT_PANEL_END');

const pop = await page.locator('#sync-popover').boundingBox();
if (pop) {
  await page.screenshot({ path: `${OUT}/07b-account-panel-clip.png`, clip: { x: Math.max(0,pop.x-8), y: Math.max(0,pop.y-8), width: pop.width+16, height: pop.height+16 } });
}

// 8) Test the copy button
const copyBtn = page.locator('#copy-mcp');
const mcpUrl = await page.locator('#mcp-url').textContent();
console.log('MCP_URL', JSON.stringify(mcpUrl));
await copyBtn.click();
await page.waitForTimeout(300);
const copyLabel = await copyBtn.textContent();
console.log('COPY_BTN_LABEL_AFTER_CLICK', JSON.stringify(copyLabel));

// Read clipboard if permission allows
let clip = null;
try {
  clip = await page.evaluate(() => navigator.clipboard.readText());
} catch (e) { clip = 'READ_BLOCKED: ' + e.message; }
console.log('CLIPBOARD', JSON.stringify(clip));

// sign-out copy
const signOutText = await page.locator('#sign-out').textContent().catch(() => null);
console.log('SIGN_OUT_LABEL', JSON.stringify(signOutText));

// Save the signed-in state
await ctx.storageState({ path: `${OUT}/state-loggedin.json` });

console.log('--- BROWSER LOGS ---');
console.log(logs.join('\n'));
await browser.close();
