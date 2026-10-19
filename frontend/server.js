const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = process.env.PORT || 5000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const SRC_DIR = path.join(__dirname, 'src');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let relativePath = req.url === '/' ? 'index.html' : req.url;

  // Limpiar query params si los hay
  relativePath = relativePath.split('?')[0];

  // Sanitización estricta contra Path Traversal
  const safeSuffix = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.resolve(PUBLIC_DIR, safeSuffix);

  // Asegurar que no se escape de los directorios permitidos
  const isInsidePublic = filePath.startsWith(PUBLIC_DIR);
  const isInsideSrc = filePath.startsWith(SRC_DIR);

  if (!isInsidePublic || !fs.existsSync(filePath)) {
    filePath = path.resolve(SRC_DIR, safeSuffix);
  }

  const validPath = (filePath.startsWith(PUBLIC_DIR) || filePath.startsWith(SRC_DIR)) &&
                    fs.existsSync(filePath) &&
                    fs.statSync(filePath).isFile();

  if (validPath) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found - Frontend Server');
  }
});

server.listen(PORT, () => {
  console.log(`[Frontend] Servidor web iniciado en http://localhost:${PORT}`);
  console.log(`[Frontend] Plataforma VI CITY - Módulo Frontend`);
});
