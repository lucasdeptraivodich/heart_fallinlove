const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const CONFIG_FILE = path.join(__dirname, 'config.json');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // --- API LẤY CẤU HÌNH SERVER ---
  if (req.method === 'GET' && pathname === '/api/config') {
    fs.readFile(CONFIG_FILE, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'Không thể đọc cấu hình' }));
      }
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(data);
    });
    return;
  }

  // --- API TỰ ĐỘNG PHÁT HIỆN LINK NGROK ĐANG CHẠY (NẾU CÓ) ---
  if (req.method === 'GET' && pathname === '/api/detect-ngrok') {
    const ngrokReq = http.get('http://127.0.0.1:4040/api/tunnels', (nRes) => {
      let data = '';
      nRes.on('data', chunk => { data += chunk; });
      nRes.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const tunnel = (parsed.tunnels || []).find(t => t.public_url && t.public_url.startsWith('https://')) || (parsed.tunnels || [])[0];
          if (tunnel && tunnel.public_url) {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            return res.end(JSON.stringify({ success: true, url: tunnel.public_url }));
          }
        } catch (e) {}
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false }));
      });
    });
    ngrokReq.on('error', () => {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false }));
    });
    return;
  }

  // --- API LƯU CẤU HÌNH TRỰC TIẾP LÊN SERVER (Để người ngoài mở link ngrok xem được 100%) ---
  if (req.method === 'POST' && pathname === '/api/save-config') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const newConfig = JSON.parse(body);
        fs.writeFile(CONFIG_FILE, JSON.stringify(newConfig, null, 2), 'utf8', err => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
            return res.end(JSON.stringify({ success: false, error: err.message }));
          }
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: true }));
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: 'Dữ liệu không hợp lệ' }));
      }
    });
    return;
  }

  // --- ROUTE TRANG TĨNH & ROUTE TẮT (/me, /crush, /emgai) ---
  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  let targetPath = pathname;
  if (cleanPath === '/' || cleanPath === '/me' || cleanPath === '/crush' || cleanPath === '/emgai') {
    targetPath = '/index.html';
  }

  let filePath = path.join(__dirname, targetPath);

  fs.stat(filePath, (statErr, stats) => {
    if (!statErr && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Not Found');
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(`Server Error: ${err.code}`);
        }
      } else {
        res.writeHead(200, {
          'Content-Type': `${contentType}; charset=utf-8`,
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0'
        });
        res.end(content, 'utf-8');
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});
