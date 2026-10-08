const { chromium } = require('playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');

async function run() {
  const url = (process.argv[2] || '').replace(/\/$/, '');
  if (!url.startsWith('https://')) throw new Error('HTTPS preview URL required');
  fs.mkdirSync('artifacts/qa', { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const cases = [
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'laptop-1024', width: 1024, height: 768 },
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'mobile-360', width: 360, height: 800 }
  ];
  try {
    for (const item of cases) {
      const page = await browser.newPage({ viewport: { width: item.width, height: item.height }, deviceScaleFactor: 1 });
      await page.goto(url + '/?visual-qa=' + encodeURIComponent(item.name), { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.locator('.hero-grid').waitFor({ state: 'visible' });
      await page.evaluate(async () => { await document.fonts.ready; });
      const state = await page.evaluate(() => {
        const hero = document.querySelector('.hero-grid');
        return {
          title: document.title,
          horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
          bodyWidth: document.body.scrollWidth,
          heroRect: { width: Math.round(hero.getBoundingClientRect().width), height: Math.round(hero.getBoundingClientRect().height) },
          books: document.querySelectorAll('.book-card').length,
          anchors: Array.from(document.querySelectorAll('a[href^="#"]')).filter(a => !document.getElementById(a.getAttribute('href').slice(1))).map(a => a.outerHTML),
          noindex: !!document.querySelector('meta[name="robots"][content*="noindex"]')
        };
      });
      assert.ok(state.title.includes('Антон Верт'));
      assert.equal(state.books, 3, 'Book cards must be visible in the DOM');
      assert.deepEqual(state.anchors, [], 'Broken internal anchor links');
      assert.ok(state.horizontalOverflow <= 1, item.name + ' has horizontal overflow of ' + state.horizontalOverflow + 'px');
      assert.equal(state.noindex, true, 'Staging must stay noindex');
      await page.screenshot({ path: 'artifacts/qa/' + item.name + '-viewport.png', fullPage: false });
      await page.locator('.hero-grid').screenshot({ path: 'artifacts/qa/' + item.name + '-hero.png' });
      await page.locator('#books').scrollIntoViewIfNeeded();
      const bookImage = page.locator('img[src="assets/energy-merch-cover.webp"]');
      await bookImage.scrollIntoViewIfNeeded();
      await bookImage.evaluate(img => new Promise((resolve, reject) => {
        if (img.complete && img.naturalWidth > 0) return resolve();
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', reject, { once: true });
      }));
      assert.equal(await bookImage.evaluate(img => img.naturalWidth), 360);
      if (item.name === 'desktop-1440') await page.locator('#books .books-grid').screenshot({ path: 'artifacts/qa/books-desktop.png' });
      console.log(JSON.stringify({ viewport: item.name, status: 'PASS', ...state }));
      await page.close();
    }
    const response = await browser.newPage().then(async page => {
      const r = await page.request.get(url + '/favicon.svg', { timeout: 30000 });
      await page.close();
      return r;
    });
    assert.equal(response.status(), 200, 'favicon should be present');
    console.log('PASS favicon HTTP 200');
  } finally {
    await browser.close();
  }
}
run().catch(err => { console.error(err); process.exit(1); });
