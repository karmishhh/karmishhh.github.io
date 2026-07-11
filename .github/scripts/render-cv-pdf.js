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
      if (h2 && h2.textContent.trim() === 'Extracurricular Activities') {
        anchor = s;
        break;
      }
    }
    const wrap = document.createElement('section');
    wrap.className = 'cv-section cv-publications';
    wrap.innerHTML = '<h2>Publications</h2>' + html;

    wrap.querySelectorAll('.item .meta').forEach((el) => {
      el.textContent = el.textContent.replace(/\s*·\s*/g, ', ');
    });

    if (anchor) {
      anchor.parentNode.insertBefore(wrap, anchor);
    } else {
      document.querySelector('.container').appendChild(wrap);
    }
  }, pubsHtml);

  await page.emulateMedia({ media: 'print' });

  const footerTemplate = `
    <div style="width:100%;text-align:center;font-family:'Times New Roman',Times,serif;font-size:9pt;color:#000;">
      New Delhi, India - 110059
    </div>`;

  await page.pdf({
    path: path.join(repoRoot, 'Kartik_Mishra_CV.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '12mm', bottom: '18mm', left: '16mm', right: '16mm' },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate,
  });

  await browser.close();
})();
