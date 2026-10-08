const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

async function main() {
  const url = process.argv[2];
  const label = process.argv[3];
  if (!url || !label) throw new Error('Usage: capture-books.cjs <url> <label>');

  const outputDir = path.join('artifacts', 'book-preview');
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  try {
    for (const viewport of [
      { name: 'desktop-1440', width: 1440, height: 1100, capture: true },
      { name: 'laptop-1024', width: 1024, height: 900 },
      { name: 'tablet-768', width: 768, height: 900 },
      { name: 'mobile-390', width: 390, height: 844, capture: true },
      { name: 'mobile-360', width: 360, height: 800 },
    ]) {
      const context = await browser.newContext({ viewport });
      await context.addInitScript(() => {
        try { localStorage.setItem('antonvert_analytics_consent_v1', 'denied'); } catch (_) {}
      });
      const page = await context.newPage();
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      await page.addStyleTag({ content: '.site-header,.skip-link{display:none!important}' });
      await page.locator('#books').scrollIntoViewIfNeeded();
      await page.locator('#books img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
      await page.evaluate(() => document.fonts.ready);

      const state = await page.evaluate(() => ({
        horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
        cards: Array.from(document.querySelectorAll('.book-card')).map(card => {
          const art = card.querySelector('.book-art').getBoundingClientRect();
          const image = card.querySelector('.book-art img').getBoundingClientRect();
          return {
            art: { width: Math.round(art.width), height: Math.round(art.height) },
            image: { width: Math.round(image.width), height: Math.round(image.height) },
          };
        }),
      }));
      if (state.horizontalOverflow > 1) throw new Error(`${viewport.name}: horizontal overflow ${state.horizontalOverflow}px`);

      let outputPath = null;
      if (viewport.capture) {
        outputPath = path.join(outputDir, `${label}-${viewport.name}.png`);
        await page.locator('#books .books-grid').screenshot({ path: outputPath });
      }
      console.log(JSON.stringify({ label, viewport: viewport.name, outputPath, ...state }));
      await context.close();
    }
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
