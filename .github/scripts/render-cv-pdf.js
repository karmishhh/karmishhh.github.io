const { chromium } = require('playwright');
const path = require('path');
const { pathToFileURL } = require('url');

(async () => {
  const repoRoot = path.resolve(__dirname, '..', '..');
  const toUrl = (rel) => pathToFileURL(path.join(repoRoot, rel)).toString();

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(toUrl('publications.html'), { waitUntil: 'networkidle' });
  const pubsHtml = await page.$$eval('.container .item', (nodes) =>
    nodes.map((n) => n.outerHTML).join('\n')
  );

  await page.goto(toUrl('cv.html'), { waitUntil: 'networkidle' });
  await page.evaluate((html) => {
    const sections = document.querySelectorAll('.container .cv-section');
    let anchor = null;
    for (const s of sections) {
      const h2 = s.querySelector('h2');
      if (h2 && h2.textContent.trim() === 'Extracurricular') {
        anchor = s;
        break;
      }
    }
    const wrap = document.createElement('section');
    wrap.className = 'cv-section cv-publications';
    wrap.innerHTML = '<h2>Publications</h2>' + html;
    if (anchor) {
      anchor.parentNode.insertBefore(wrap, anchor);
    } else {
      document.querySelector('.container').appendChild(wrap);
    }
  }, pubsHtml);

  await page.emulateMedia({ media: 'print' });

  await page.pdf({
    path: path.join(repoRoot, 'Kartik_Mishra_CV.pdf'),
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
  });

  await browser.close();
})();
