import { chromium } from 'playwright-core';

const EXEC = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = '/tmp/ui-audit/a11y';
const browser = await chromium.launch({ executablePath: EXEC, headless: true });

function luminance(r, g, b) {
  const a = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
function contrast(rgb1, rgb2) {
  const L1 = luminance(...rgb1), L2 = luminance(...rgb2);
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}
function parseRGB(s) {
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(',').map(x => parseFloat(x.trim()));
  return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]];
}
// flatten alpha over bg
function flatten(fg, bg) {
  if (fg[3] === 1) return [fg[0], fg[1], fg[2]];
  const a = fg[3];
  return [0,1,2].map(i => Math.round(fg[i]*a + bg[i]*(1-a)));
}

// ============ ENTRY PASS ============
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('https://openhumandesign.com', { waitUntil: 'networkidle' });

// Tab order from top of document
async function tabSequence(p, n) {
  const seq = [];
  for (let i = 0; i < n; i++) {
    await p.keyboard.press('Tab');
    const info = await p.evaluate(() => {
      const a = document.activeElement;
      if (!a) return null;
      const cs = getComputedStyle(a);
      const r = a.getBoundingClientRect();
      return {
        tag: a.tagName,
        id: a.id || null,
        cls: (a.className && a.className.baseVal !== undefined) ? a.className.baseVal : (typeof a.className === 'string' ? a.className : null),
        text: (a.textContent || '').trim().slice(0, 30),
        type: a.getAttribute('type'),
        role: a.getAttribute('role'),
        ariaLabel: a.getAttribute('aria-label'),
        outlineStyle: cs.outlineStyle,
        outlineWidth: cs.outlineWidth,
        outlineColor: cs.outlineColor,
        boxShadow: cs.boxShadow,
        visible: r.width > 0 && r.height > 0
      };
    });
    seq.push(info);
  }
  return seq;
}

await page.evaluate(() => { document.body.focus(); window.scrollTo(0,0); });
const entryTab = await tabSequence(page, 14);
console.log('=== ENTRY FORM TAB ORDER ===');
entryTab.forEach((s, i) => console.log(`${i+1}. <${s?.tag}> id=${s?.id} role=${s?.role||'-'} cls="${(s?.cls||'').slice(0,40)}" text="${s?.text}" outline=${s?.outlineStyle}/${s?.outlineWidth}/${s?.outlineColor} shadow=${s?.boxShadow==='none'?'none':'yes'}`));

// Focus the place input, type, check autocomplete keyboard
await page.click('#birth-place');
await page.fill('#birth-place', 'Lond');
await page.waitForTimeout(900);
const placeOpen = await page.evaluate(() => {
  const r = document.getElementById('place-results');
  const items = [...document.querySelectorAll('.place-result')];
  return { hidden: r.classList.contains('hidden'), count: items.length,
    firstTag: items[0]?.tagName, hasActive: items.some(i=>i.classList.contains('active')),
    listRole: r.getAttribute('role'), inputAria: document.getElementById('birth-place').outerHTML.slice(0,200) };
});
console.log('\n=== PLACE AUTOCOMPLETE (after typing "Lond") ===');
console.log(JSON.stringify(placeOpen, null, 2));

// ArrowDown then read aria state
await page.keyboard.press('ArrowDown');
const afterArrow = await page.evaluate(() => {
  const active = document.querySelector('.place-result.active');
  const input = document.getElementById('birth-place');
  return {
    activeText: active?.textContent?.trim().slice(0,40),
    activeId: active?.id || null,
    inputAriaActivedescendant: input.getAttribute('aria-activedescendant'),
    inputAriaExpanded: input.getAttribute('aria-expanded'),
    inputAriaAutocomplete: input.getAttribute('aria-autocomplete'),
    activeFocused: document.activeElement === active
  };
});
console.log('\n=== AFTER ArrowDown ===');
console.log(JSON.stringify(afterArrow, null, 2));
await page.keyboard.press('Escape');
const afterEsc = await page.evaluate(() => ({ hidden: document.getElementById('place-results').classList.contains('hidden') }));
console.log('After Escape, results hidden:', afterEsc.hidden);

// Computed contrast of text tiers on entry
console.log('\n=== CONTRAST: text tiers (light mode) ===');
const tierSel = {
  'entry-title (h1)': '.entry-title',
  'entry-subtitle': '.entry-subtitle',
  'form label': '.form-group label',
  'label-soft': '.label-soft',
  'checkbox-label': '.checkbox-label',
  'btn-primary text': '.btn-primary',
  'link-button': '.link-button',
  'footer text': '.footer span',
  'footer link': '.footer a'
};
for (const [name, sel] of Object.entries(tierSel)) {
  const data = await page.evaluate((sel) => {
    const e = document.querySelector(sel);
    if (!e) return null;
    const cs = getComputedStyle(e);
    // walk up for effective bg
    let bgEl = e, bg = 'rgba(0,0,0,0)';
    while (bgEl) { const b = getComputedStyle(bgEl).backgroundColor; if (b && b!=='rgba(0, 0, 0, 0)' && b!=='transparent'){bg=b;break;} bgEl=bgEl.parentElement; }
    return { color: cs.color, bg, fontSize: cs.fontSize, fontWeight: cs.fontWeight };
  }, sel);
  if (!data) { console.log(`${name}: NOT FOUND`); continue; }
  const fg = flatten(parseRGB(data.color), parseRGB(data.bg) || [255,255,255]);
  const bg = (parseRGB(data.bg)||[255,255,255]).slice(0,3);
  const c = contrast(fg, bg);
  console.log(`${name}: ${c.toFixed(2)}:1  size=${data.fontSize} weight=${data.fontWeight}  fg=${data.color} bg=${data.bg}`);
}

await page.screenshot({ path: `${OUT}/entry.png` });
await browser.close();
console.log('\nDONE entry');
