import { chromium } from 'playwright-core';
const OUT = '/tmp/ui-audit/cold-landing';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await page.goto('https://openhumandesign.com/?d=1995-08-22&t=09:15&tz=-7&n=Jordan', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// nav tab label for the active chart view
const activeNav = await page.locator('.nav-link.active').innerText().catch(()=>'?');
console.log('ACTIVE NAV TAB:', activeNav);

// Make my own chart: open New chart, fill, submit. Time the steps.
await page.selectOption('#people-switcher', { label: '+ New chart…' });
await page.waitForTimeout(800);
// fill the form
await page.fill('#birth-name', 'Sam');
await page.fill('#birth-date', '1990-06-15');
await page.fill('#birth-time', '14:30');
// birth place — try typeahead
await page.fill('#birth-place', 'Austin');
await page.waitForTimeout(1800);
const placeResults = await page.locator('.place-result').allTextContents().catch(()=>[]);
console.log('PLACE RESULTS for "Austin":', JSON.stringify(placeResults.slice(0,4)));
await page.screenshot({ path: `${OUT}/05-place-typeahead.png` });
if (placeResults.length) {
  await page.locator('.place-result').first().click();
  await page.waitForTimeout(600);
}
await page.screenshot({ path: `${OUT}/06-form-filled.png`, fullPage:true });
// submit
await page.click('button:has-text("View My Chart")').catch(e=>console.log('submit click err', e.message));
await page.waitForTimeout(2500);
const h1after = await page.locator('h1').allTextContents().catch(()=>[]);
const bodyTop = (await page.locator('body').innerText()).slice(0,200);
console.log('AFTER SUBMIT h1:', JSON.stringify(h1after));
console.log('AFTER SUBMIT body top:', bodyTop.replace(/\n/g,' | '));
// now does the switcher have both Jordan and Sam?
const opts = await page.locator('#people-switcher option').allTextContents();
console.log('SWITCHER NOW:', JSON.stringify(opts));
await page.screenshot({ path: `${OUT}/07-my-own-chart.png` });

await browser.close();
