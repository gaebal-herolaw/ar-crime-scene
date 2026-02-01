// Auto-compile: opens compile-marker.html in puppeteer, clicks compile, waits for save
const http = require('http');

async function compile() {
  // Use dynamic import for puppeteer
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER:', msg.text()));

  console.log('Opening compile page...');
  await page.goto('http://localhost:3000/compile-marker.html', { waitUntil: 'networkidle0' });

  console.log('Clicking compile...');
  await page.click('#compileBtn');

  // Wait for status to say "완료" or "저장됨"
  await page.waitForFunction(
    () => {
      const el = document.getElementById('status');
      return el && (el.textContent.includes('완료') || el.textContent.includes('저장'));
    },
    { timeout: 120000 }
  );

  const statusText = await page.$eval('#status', el => el.textContent);
  console.log('Result:', statusText);

  await browser.close();
}

compile().catch(e => { console.error(e.message); process.exit(1); });
