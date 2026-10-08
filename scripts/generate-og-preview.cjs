const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

async function main() {
  const root = path.resolve(__dirname, '..');
  const portrait = fs.readFileSync(path.join(root, 'assets', 'anton-hero-smile.jpeg')).toString('base64');
  const output = path.join(root, 'assets', 'og-antonvert-1200x630.png');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    await page.setContent(`<!doctype html>
      <html lang="ru">
      <head>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Prata&display=swap');
          * { box-sizing: border-box; }
          html, body { width: 1200px; height: 630px; margin: 0; overflow: hidden; }
          body { background: #f8fafc; }
          .canvas {
            position: relative;
            width: 1200px;
            height: 630px;
            overflow: hidden;
            color: #192334;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 58%, #eef3fa 100%);
          }
          .accent-bar { position: absolute; inset: 0 auto 0 0; width: 14px; background: #3f69af; }
          .accent-ring {
            position: absolute;
            right: -88px;
            bottom: -154px;
            width: 390px;
            height: 390px;
            border: 72px solid rgba(63, 105, 175, .12);
            border-radius: 50%;
          }
          .copy { position: absolute; z-index: 2; top: 76px; left: 72px; width: 665px; }
          .name {
            margin: 0;
            color: #3f69af;
            font-family: Manrope, Arial, sans-serif;
            font-size: 27px;
            font-weight: 800;
            letter-spacing: .12em;
            text-transform: uppercase;
          }
          .rule { width: 76px; height: 7px; margin-top: 24px; border-radius: 999px; background: #3f69af; }
          h1 {
            width: 665px;
            margin: 38px 0 0;
            font-family: Prata, Georgia, serif;
            font-size: 54px;
            font-weight: 400;
            line-height: 1.17;
            letter-spacing: -.035em;
          }
          .descriptor {
            margin: 40px 0 0;
            color: #536173;
            font-family: Manrope, Arial, sans-serif;
            font-size: 20px;
            font-weight: 600;
            letter-spacing: .01em;
          }
          .portrait {
            position: absolute;
            z-index: 1;
            top: 0;
            right: 0;
            width: 470px;
            height: 630px;
            overflow: hidden;
            background: #f8f8f8;
          }
          .portrait::before {
            content: '';
            position: absolute;
            z-index: 2;
            inset: 0 auto 0 0;
            width: 72px;
            background: linear-gradient(90deg, #f8fafc 0%, rgba(248, 250, 252, 0) 100%);
          }
          .portrait img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            object-position: right center;
          }
        </style>
      </head>
      <body>
        <main class="canvas">
          <div class="accent-bar"></div>
          <div class="accent-ring"></div>
          <section class="copy">
            <p class="name">Антон Верт</p>
            <div class="rule"></div>
            <h1>Помогаю основателям<br>привлекать клиентов<br>лично и публично</h1>
            <p class="descriptor">B2B-продажи · доверительные коммуникации</p>
          </section>
          <div class="portrait"><img src="data:image/jpeg;base64,${portrait}" alt=""></div>
        </main>
      </body>
      </html>`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: output, type: 'png' });
    console.log(`Generated ${output}`);
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
