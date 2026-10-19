const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

describe('Pruebas Unitarias del Módulo Frontend - VI CITY (Abner)', () => {
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
});
