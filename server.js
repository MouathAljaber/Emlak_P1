import http from 'node:http';
import path from 'node:path';
import { readFile, stat } from 'node:fs/promises';

// Load .env (no dependencies) so RESEND_API_KEY etc. work locally.
try {
  const env = await readFile(path.resolve(process.cwd(), '.env'), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch {}

import { processOffer } from './lib/offer.js';

const hits = new Map();
function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

const root = path.resolve(process.cwd());
const port = Number(process.env.PORT || 3000);
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon'
};

async function resolveFile(urlPath) {
  let pathname;
  try {
    pathname = decodeURIComponent(urlPath.split('?')[0]);
  } catch {
    return null;
  }
  if (pathname === '/') pathname = '/index.html';
  else if (pathname.endsWith('/') || !path.extname(pathname)) {
    pathname = pathname.replace(/\/$/, '') + '/index.html';
  }

  const resolved = path.resolve(root, `.${pathname}`);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) return null;

  try {
    if ((await stat(resolved)).isFile()) return resolved;
  } catch {}
  return null;
}


async function handleOffer(req, res) {
  const ip = req.socket.remoteAddress || 'x';
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= 5) return sendJson(res, 429, { ok: false, error: 'rate_limited' });
  hits.set(ip, [...recent, now]);
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 50_000) return sendJson(res, 413, { ok: false, error: 'too_large' });
  }
  const result = await processOffer(raw, process.env);
  sendJson(res, result.status, result.body);
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && (req.url || '').split('?')[0] === '/api/offer') return handleOffer(req, res);
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Allow': 'GET, HEAD' });
    res.end();
    return;
  }

  let file = await resolveFile(req.url || '/');
  if (!file) file = await resolveFile('/404.html');
  const status = file?.endsWith('/404.html') ? 404 : 200;

  try {
    const body = await readFile(file);
    const extension = path.extname(file).toLowerCase();
    res.writeHead(status, {
      'Content-Type': mimeTypes[extension] || 'application/octet-stream',
      'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(req.method === 'HEAD' ? undefined : 'Internal server error');
  }
});

server.listen(port, () => {
  console.log(`Antalya Camp frontend running at http://localhost:${port}`);
});
