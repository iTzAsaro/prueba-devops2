const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

describe('Pruebas Unitarias del Módulo Frontend - VI CITY (Kevin)', () => {
  const rootDir = path.resolve(__dirname, '..');

  test('Debe existir package.json con scripts de test y start', () => {
    const pkgPath = path.join(rootDir, 'package.json');
    assert.strictEqual(fs.existsSync(pkgPath), true, 'package.json debe existir');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    assert.strictEqual(typeof pkg.scripts.start, 'string', 'Debe tener script start');
    assert.strictEqual(typeof pkg.scripts.test, 'string', 'Debe tener script test');
  });

  test('Debe existir index.html con estructura semántica del SPA VI CITY', () => {
    const htmlPath = path.join(rootDir, 'public', 'index.html');
    assert.strictEqual(fs.existsSync(htmlPath), true, 'public/index.html debe existir');
    const content = fs.readFileSync(htmlPath, 'utf8');
    assert.match(content, /<!DOCTYPE html>/i, 'Debe contener DOCTYPE');
    assert.match(content, /id="app"/, 'Debe contener el mount point #app');
    assert.match(content, /id="navbar"/, 'Debe contener el navbar');
    assert.match(content, /id="toast-stack"/, 'Debe contener el stack de toasts');
    assert.match(content, /type="module"/, 'Debe cargar app.js como módulo ES');
  });

  test('Deben existir los archivos base de estilos y lógica', () => {
    assert.strictEqual(fs.existsSync(path.join(rootDir, 'src', 'style.css')), true);
    assert.strictEqual(fs.existsSync(path.join(rootDir, 'src', 'app.js')), true);
  });

  test('Debe existir la capa de datos del catálogo', () => {
    const catPath = path.join(rootDir, 'src', 'data', 'catalog.js');
    assert.strictEqual(fs.existsSync(catPath), true, 'catalog.js debe existir');
    const content = fs.readFileSync(catPath, 'utf8');
    assert.match(content, /EDITIONS/, 'Debe definir ediciones');
    assert.match(content, /PLATFORMS/, 'Debe definir plataformas');
    assert.match(content, /RELEASE_DATE/, 'Debe definir fecha de lanzamiento');
  });

  test('Debe existir el store con persistencia LocalStorage', () => {
    const storePath = path.join(rootDir, 'src', 'store', 'index.js');
    assert.strictEqual(fs.existsSync(storePath), true);
    const content = fs.readFileSync(storePath, 'utf8');
    assert.match(content, /localStorage/, 'Debe usar LocalStorage');
  });

  test('Debe existir el router SPA', () => {
    const routerPath = path.join(rootDir, 'src', 'router.js');
    assert.strictEqual(fs.existsSync(routerPath), true);
    const content = fs.readFileSync(routerPath, 'utf8');
    assert.match(content, /hashchange/, 'Debe escuchar hashchange');
  });

  test('Deben existir las 5 páginas del comprador', () => {
    const pages = ['home.js', 'customizer.js', 'checkout.js', 'success.js', 'dashboard.js'];
    pages.forEach(p => {
      assert.strictEqual(fs.existsSync(path.join(rootDir, 'src', 'pages', p)), true, `pages/${p} debe existir`);
    });
  });

  test('Las utilidades deben incluir validación Luhn y helpers de UI', () => {
    const uiPath = path.join(rootDir, 'src', 'utils', 'ui.js');
    assert.strictEqual(fs.existsSync(uiPath), true);
    const content = fs.readFileSync(uiPath, 'utf8');
    assert.match(content, /validateCardNumber/, 'Debe validar número de tarjeta');
    assert.match(content, /validateEmail/, 'Debe validar email');
    assert.match(content, /function toast/, 'Debe tener sistema de toasts');
    assert.match(content, /function modal/, 'Debe tener sistema de modales');
  });

  test('Hotfix v1.0.1: Validaciones de UI deben manejar valores null, undefined o no-string sin excepción', () => {
    const uiPath = path.join(rootDir, 'src', 'utils', 'ui.js');
    const content = fs.readFileSync(uiPath, 'utf8');
    assert.match(content, /if\s*\(typeof v !== 'string'\)\s*return false;/, 'validateEmail debe verificar tipo string');
    assert.match(content, /if\s*\(!v \|\| typeof v !== 'string'\)\s*return false;/, 'validateCardNumber debe ser seguro');
  });

  test('Componente Hero: renderHero debe generar estructura HTML y montar controladores', async () => {
    const { renderHero } = await import('../src/components/hero.js');
    assert.strictEqual(typeof renderHero, 'function', 'renderHero debe ser una función');
    const mount = renderHero();
    assert.strictEqual(typeof mount, 'function', 'renderHero debe retornar función mount');

    const listeners = {};
    const mockEl = {
      innerHTML: '',
      addEventListener: (evt, cb) => { listeners[evt] = cb; }
    };
    let injectedHtml = '';
    const mockRoot = {
      insertAdjacentHTML: (pos, html) => { injectedHtml = html; },
      querySelector: () => mockEl
    };
    globalThis.window = { location: { hash: '' } };

    const stop = mount(mockRoot);
    assert.match(injectedHtml, /hero__title/, 'El HTML generado debe contener el título del Hero');
    assert.match(injectedHtml, /hero__platforms/, 'El HTML generado debe contener las plataformas');
    if (typeof stop === 'function') stop();
  });
});

describe('Servidor HTTP del Frontend — entrega de assets estáticos', () => {
  // Regresión: el servidor sólo respondía "/" y devolvía 404 para app.js y
  // style.css, por lo que la SPA quedaba en blanco en cualquier entorno.
  const server = require('../server');
  let baseUrl;

  before(async () => {
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  test('GET / debe entregar index.html del SPA', async () => {
    const res = await fetch(`${baseUrl}/`);
    const body = await res.text();

    assert.strictEqual(res.status, 200);
    assert.match(res.headers.get('content-type') || '', /text\/html/);
    assert.match(body, /id="app"/);
  });

  test('Debe servir los assets que index.html referencia (app.js, style.css y módulos)', async () => {
    const assets = [
      ['/app.js', /application\/javascript/],
      ['/style.css', /text\/css/],
      ['/router.js', /application\/javascript/],
      ['/components/hero.js', /application\/javascript/],
      ['/pages/home.js', /application\/javascript/]
    ];

    for (const [asset, expectedType] of assets) {
      const res = await fetch(`${baseUrl}${asset}`);
      assert.strictEqual(res.status, 200, `${asset} debe responder 200`);
      assert.match(res.headers.get('content-type') || '', expectedType, `${asset} debe declarar su Content-Type`);
    }
  });

  test('Debe responder 404 en rutas inexistentes', async () => {
    const res = await fetch(`${baseUrl}/no-existe.html`);
    assert.strictEqual(res.status, 404);
  });

  test('Debe bloquear intentos de path traversal fuera de public/ y src/', async () => {
    const res = await fetch(`${baseUrl}/..%2Fpackage.json`);
    assert.notStrictEqual(res.status, 200, 'No debe exponer archivos fuera de los directorios permitidos');

    const body = await res.text();
    assert.doesNotMatch(body, /devops-microservice-frontend/);
  });

  test('Debe responder HEAD sin cuerpo y 405 para métodos no permitidos', async () => {
    const head = await fetch(`${baseUrl}/style.css`, { method: 'HEAD' });
    assert.strictEqual(head.status, 200);

    const post = await fetch(`${baseUrl}/style.css`, { method: 'POST' });
    assert.strictEqual(post.status, 405);
  });
});
