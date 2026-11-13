const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = process.env.PORT || 5000;
const BACKEND_URL = process.env.BACKEND_URL;
const PUBLIC_DIR = path.join(__dirname, 'public');
const SRC_DIR = path.join(__dirname, 'src');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
// En desarrollo no se cachea para que un cambio se vea al recargar el navegador.
const CACHE_CONTROL = IS_PRODUCTION ? 'public, max-age=3600' : 'no-cache';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

/**
 * Convierte una URL en una ruta relativa segura.
 * Devuelve null si la petición intenta salir de los directorios permitidos
 * o si la codificación es inválida.
 */
function toSafeRelativePath (rawUrl) {
  let pathname;

  try {
    pathname = decodeURIComponent((rawUrl || '/').split('?')[0].split('#')[0]);
  } catch {
    return null; // URI malformada (por ejemplo %E0)
  }

  if (pathname.includes('\0')) return null;

  // Quita las barras iniciales: path.join() descartaría la base si la ruta es absoluta.
  const stripped = pathname.replace(/^[/\\]+/, '');
  if (stripped === '') return 'index.html';

  const normalized = path.normalize(stripped);
  if (normalized === '..' || normalized.startsWith(`..${path.sep}`) || path.isAbsolute(normalized)) {
    return null;
  }

  return normalized;
}

function isServableFile (filePath, baseDir) {
  const resolvedBase = path.resolve(baseDir);
  const resolvedFile = path.resolve(filePath);

  if (resolvedFile !== resolvedBase && !resolvedFile.startsWith(resolvedBase + path.sep)) {
    return false;
  }

  try {
    return fs.statSync(resolvedFile).isFile();
  } catch {
    return false;
  }
}

/**
 * Resuelve un archivo estático: primero public/ y luego src/,
 * que es donde viven los módulos ES y los estilos del SPA.
 */
function resolveStaticFile (relativePath) {
  const fromPublic = path.join(PUBLIC_DIR, relativePath);
  if (isServableFile(fromPublic, PUBLIC_DIR)) return fromPublic;

  const fromSrc = path.join(SRC_DIR, relativePath);
  if (isServableFile(fromSrc, SRC_DIR)) return fromSrc;

  return null;
}

const server = http.createServer((req, res) => {
  // Proxy inverso hacia la API Backend cuando BACKEND_URL está definido
  if (BACKEND_URL && req.url && req.url.startsWith('/api')) {
    try {
      const targetUrl = new URL(req.url, BACKEND_URL);
      const proxyReq = http.request(targetUrl, {
        method: req.method,
        headers: { ...req.headers, host: targetUrl.host }
      }, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      });
      proxyReq.on('error', () => {
        res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Bad Gateway - Backend unreachable' }));
      });
      req.pipe(proxyReq);
      return;
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('500 Internal Proxy Error');
      return;
    }
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8', Allow: 'GET, HEAD' });
    res.end('405 Method Not Allowed - Frontend Server');
    return;
  }

  const relativePath = toSafeRelativePath(req.url);
  const filePath = relativePath ? resolveStaticFile(relativePath) : null;

  if (!filePath) {
    res.writeHead(relativePath ? 404 : 400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(relativePath ? '404 Not Found - Frontend Server' : '400 Bad Request - Frontend Server');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
    'Cache-Control': CACHE_CONTROL,
    'X-Content-Type-Options': 'nosniff'
  });

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  const stream = fs.createReadStream(filePath);
  stream.on('error', () => res.destroy());
  stream.pipe(res);
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[Frontend] Servidor web iniciado en http://localhost:${PORT}`);
    console.log(`[Frontend] Plataforma VI CITY - Módulo Frontend`);
    console.log(`[Frontend] Entorno: ${process.env.NODE_ENV || 'development'} | Cache: ${CACHE_CONTROL}`);
  });
}

module.exports = server;
