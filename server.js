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
