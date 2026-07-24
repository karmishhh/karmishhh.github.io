const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.json': 'application/json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function startServer(rootDir) {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    const rel = urlPath === '/' ? '/index.html' : urlPath;
    const filePath = path.resolve(path.join(rootDir, rel));
    if (!filePath.startsWith(rootDir)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

(async () => {
  const repoRoot = path.resolve(__dirname, '..', '..');
  const server = await startServer(repoRoot);
  const { port } = server.address();
  const cvUrl = `http://127.0.0.1:${port}/cv.html`;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(cvUrl, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => {
    const el = document.getElementById('cv-publications');
    return el && el.getAttribute('data-loaded');
  }, null, { timeout: 15000 });

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
  server.close();
})();
