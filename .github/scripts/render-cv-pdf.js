const { chromium } = require('playwright');
const path = require('path');
const { pathToFileURL } = require('url');

(async () => {
  const repoRoot = path.resolve(__dirname, '..', '..');
  const cvUrl = pathToFileURL(path.join(repoRoot, 'cv.html')).toString();

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(cvUrl, { waitUntil: 'networkidle' });
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
