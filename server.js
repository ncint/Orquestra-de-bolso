const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const clients = new Set();
const state = {
  count: 0,
  mode: 'livre',
  waveActive: false,
};

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function broadcast(event, data, exclude = null) {
  const payload = `data: ${JSON.stringify({ event, ...data })}\n\n`;
  for (const res of clients) {
    if (res === exclude) continue;
    res.write(payload);
  }
}

function localIPs() {
  const result = [];
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) result.push(iface.address);
    }
  }
  return result;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    res.write('retry: 1000\n\n');
    clients.add(res);
    state.count = clients.size;
    broadcast('count', { count: state.count });
    broadcast('mode', { mode: state.mode }, res);
    req.on('close', () => {
      clients.delete(res);
      state.count = clients.size;
      broadcast('count', { count: state.count });
    });
    return;
  }

  if (url.pathname === '/play' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        broadcast('play', {
          instrument: String(data.instrument || 'perc'),
          pad: String(data.pad || '0'),
          who: Number(data.who) || 0,
          group: Number(data.group) || 1,
        }, res);
        broadcast('count', { count: clients.size }, res);
      } catch {}
      res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
      res.end('ok');
    });
    return;
  }

  if (url.pathname === '/mode' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        if (['livre', 'grupos', 'um-grupo', 'onda'].includes(data.mode)) {
          state.mode = data.mode;
          broadcast('mode', { mode: state.mode });
        }
        if (typeof data.activeGroup === 'number') {
          broadcast('activeGroup', { activeGroup: data.activeGroup });
        }
        if (data.waveActive !== undefined) {
          state.waveActive = !!data.waveActive;
          broadcast('wave', { waveActive: state.waveActive });
        }
      } catch {}
      res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
      res.end('ok');
    });
    return;
  }

  let filePath = url.pathname === '/' ? '/index.html' : url.pathname;
  filePath = path.normalize(path.join(PUBLIC_DIR, filePath));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403); res.end(); return;
  }
  fs.readFile(filePath, (err, buf) => {
    if (err) { res.writeHead(404); res.end('não encontrado'); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(buf);
  });
});

server.listen(PORT, () => {
  const ips = localIPs();
  console.log('🎼 Orquestra de Bolso — servidor rodando!\n');
  console.log('No seu computador:  http://localhost:' + PORT);
  for (const ip of ips) {
    console.log('Nos celulares:       http://' + ip + ':' + PORT);
  }
  console.log('\nCompartilhe o endereço "Nos celulares" com os participantes.');
});
