# Evidencias IE1 e IE2 — Abner Gallardo

**Asignatura:** DOY0101 - Ingeniería DevOps  
**Proyecto:** Plataforma de Preventas VI CITY  
**Responsable:** Abner Gallardo  
**Rama de trabajo:** `feature/ie1-ie2-abner`  
**Fecha de validación local:** 2026-10-23 UTC

## 1. Objetivo

Este documento registra únicamente el trabajo de IE1 (contenedores) e IE2 (pruebas automatizadas) realizado sobre el repositorio existente. Se preservaron los trabajos de IE3, IE4 e IE5 y no se ejecutó ningún `push`, merge ni `reset --hard`.

- **IE1:** imágenes Docker multi-stage, reproducibles, ligeras y ejecutadas como usuario no root.
- **IE2:** suites nativas `node:test`, cobertura LCOV y ejecución automatizada en GitHub Actions.

## 2. Estado inicial auditado

| Elemento | Estado inicial observado |
|---|---|
| Git | Rama `main`, sin cambios locales al iniciar; último commit `44441a5` |
| Backend | Dockerfile multi-stage, pero usaba Node 18 y ocultaba errores con `|| true` |
| Frontend | Dockerfile multi-stage, pero usaba Node 18 y ocultaba errores con `|| true` |
| Lockfiles | Existían `backend/package-lock.json` y `frontend/package-lock.json` |
| Tests backend | 10 tests, 10 aprobados, 0 fallidos |
| Tests frontend | 9 tests, 9 aprobados, 0 fallidos |
| Cobertura | No existían scripts `test:coverage` |
| CI | Ejecutaba `npm test`, pero no generaba/subía cobertura ni verificaba usuario/tamaño de imágenes |
| Docker daemon local | No disponible durante la validación: Docker Desktop Linux engine no estaba iniciado |

## 3. Cambios realizados

### IE1 — Dockerfiles

- Actualizadas las imágenes base a `node:20-alpine`, compatible con Node.js 20 y con el runtime validado localmente.
- Conservadas las etapas explícitas `builder` y `production`.
- Se copian primero `package.json` y `package-lock.json` para conservar el caché de dependencias.
- Se reemplazó la instalación tolerante a fallos por `npm ci --omit=dev --ignore-scripts`, sin `|| true`.
- El runtime copia solamente el manifiesto, lockfile, dependencias de producción y archivos necesarios de la aplicación.
- Se mantiene `WORKDIR /app`, `EXPOSE 3000` para backend y `EXPOSE 5000` para frontend.
- Se mantiene el arranque real: `node src/server.js` y `node server.js`.
- Se usa `COPY --chown=node:node` y `USER node`.

### IE1 — `.dockerignore`

Ambos contextos excluyen `node_modules`, `.git`, `.github`, cobertura, tests, archivos `*.test.js`, logs, `.env`, archivos del editor y temporales. No se excluyen `src`, `public`, `server.js` ni los manifiestos necesarios.

### IE2 — scripts y cobertura

Se añadió `c8` como dependencia de desarrollo en ambos módulos porque Node.js ejecuta estas suites, pero no genera por sí solo un LCOV compatible con SonarCloud de forma uniforme entre versiones.

Scripts agregados:

```json
"test": "node --test ...",
"test:coverage": "c8 --all --exclude=tests/** --exclude=node_modules/** --reporter=text --reporter=lcov npm test"
```

La cobertura se escribe en `backend/coverage/lcov.info` y `frontend/coverage/lcov.info`. Los directorios están ignorados por Git y Docker.

### CI

Se ajustó `.github/workflows/ci.yml` sin modificar los jobs de seguridad, SonarCloud, Quality Gate ni despliegue de Paulo:

- caché de npm basada en `package-lock.json`;
- ejecución de `npm test` y `npm run test:coverage`;
- artefactos `coverage-backend` y `coverage-frontend` con `if: always()` únicamente para conservar evidencia;
- construcción de ambas imágenes con `${{ github.sha }}`;
- inspección de imágenes, usuario efectivo `node` y metadatos/tamaño;
- sin `continue-on-error`.

## 4. Resultados reales de pruebas

| Módulo | Comando | Tests | Aprobados | Fallidos | Omitidos | Resultado |
|---|---|---:|---:|---:|---:|---|
| Backend | `npm test` | 10 | 10 | 0 | 0 | ✅ |
| Frontend | `npm test` | 9 | 9 | 0 | 0 | ✅ |
| Backend | `npm run test:coverage` | 10 | 10 | 0 | 0 | ✅ |
| Frontend | `npm run test:coverage` | 9 | 9 | 0 | 0 | ✅ |

Casos backend cubiertos: healthcheck, catálogo, plataformas, listado de órdenes, creación con cálculo de total, payload inválido HTTP 400, cancelación, métricas, CORS OPTIONS y ruta inexistente HTTP 404.

Los tests frontend existentes verifican la estructura real del SPA, catálogo, persistencia LocalStorage, router hash, páginas de comprador y utilidades de validación. No se sustituyeron por mocks ni assertions triviales.

## 5. Cobertura real

| Módulo | Statements | Branches | Functions | Lines | Reporte |
|---|---:|---:|---:|---:|---|
| Backend | 85.52% | 73.40% | 76.00% | 85.52% | `backend/coverage/lcov.info` |
| Frontend | 0% | 0% | 0% | 0% | `frontend/coverage/lcov.info` |

El 0% del frontend es un resultado real: su suite actual verifica archivos y contratos mediante `fs`, pero no importa/ejecuta módulos de navegador. No se alteraron métricas para aparentar cobertura. Cualquier aumento requiere una ampliación coordinada de pruebas ejecutables con DOM/browser, fuera de este cambio de infraestructura.

## 6. Comandos de validación

```powershell
cd backend
npm ci
npm test
npm run test:coverage

cd ..\frontend
npm ci
npm test
npm run test:coverage

cd ..
docker build -t vicity-backend:ie1 .\backend
docker build -t vicity-frontend:ie1 .\frontend
docker image inspect vicity-backend:ie1
docker image inspect vicity-frontend:ie1
```

Para verificar el usuario cuando Docker Desktop esté disponible:

```powershell
docker image inspect -f '{{.Config.User}}' vicity-backend:ie1
# esperado: node
docker image inspect -f '{{.Config.User}}' vicity-frontend:ie1
# esperado: node
```

## 7. Evidencia y limitaciones

- Evidencia de tests: salida local de `npm test` y `npm run test:coverage` registrada el 2026-10-23 UTC.
- Reportes: `backend/coverage/lcov.info` y `frontend/coverage/lcov.info` generados localmente; no se versionan.
- Evidencia Docker: bloqueada localmente porque el daemon `dockerDesktopLinuxEngine` no estaba iniciado. Los Dockerfiles sí fueron revisados para que CI falle si `npm ci`, `docker build`, `inspect` o la verificación de usuario falla.
- Evidencia GitHub Actions remota: pendiente de una ejecución real; no se declara como aprobada en este documento.

## 8. Tabla de cumplimiento rastreable

| Requisito | Estado | Evidencia |
|---|---|---|
| Dockerfiles multi-stage backend/frontend | Cumplido en código | `backend/Dockerfile`, `frontend/Dockerfile` |
| Dependencias deterministas | Cumplido en código | `package-lock.json`, `npm ci --omit=dev` |
| Runtime no root | Preparado; ejecución local bloqueada | `USER node`, verificación en workflow |
| Contextos Docker optimizados | Cumplido en código | `.dockerignore` de ambos módulos |
| 10 tests backend | Cumplido | `backend/tests/backend.test.js`, 10/10 |
| 9 tests frontend | Cumplido | `frontend/tests/frontend.test.js`, 9/9 |
| Cobertura LCOV backend/frontend | Cumplido técnicamente | scripts y `coverage/lcov.info` |
| Artefactos CI | Preparado; pendiente runner remoto | `.github/workflows/ci.yml` |
| Builds Docker | Pendiente de daemon/runner | comando Docker y job `docker-build` |
| Compatibilidad IE3/IE4/IE5 | Preservada | jobs existentes y cambios acotados |

## 9. Problemas detectados y solución

1. Los Dockerfiles iniciales ocultaban fallas de `npm ci` con `|| true`; se eliminó ese patrón para que una dependencia inválida bloquee el build.
2. No había script de cobertura; se añadió `c8` y reporte de texto + LCOV.
3. La suite frontend no ejecuta lógica de navegador, por lo que su cobertura es 0%; se documenta honestamente y no se inventan pruebas.
4. Docker Desktop no estaba iniciado en la máquina de validación. La construcción e inspección final deben ejecutarse cuando el daemon esté disponible o en GitHub Actions.

## 10. Reflexión personal

La reflexión de Abner debe ser redactada por el estudiante, sin IA. Guía: ¿Qué implementé? ¿Qué problema tuve? ¿Cómo lo resolví? ¿Qué aprendí?
