const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.mind': 'application/octet-stream',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  // POST /save-mind — save compiled .mind file directly
  if (req.method === 'POST' && req.url === '/save-mind') {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      const buf = Buffer.concat(chunks);
      const dest = path.join(PUBLIC, 'targets.mind');
      fs.writeFileSync(dest, buf);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, size: buf.length }));
      console.log('Saved targets.mind (' + buf.length + ' bytes)');
    });
    return;
  }

  let filePath = path.join(PUBLIC, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Compile marker: http://localhost:${PORT}/compile-marker.html`);
  console.log(`AR page: http://localhost:${PORT}/`);
});
