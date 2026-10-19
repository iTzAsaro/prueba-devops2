# Checklist de Delegación de Tareas — EP2 DevOps

> **Asignatura:** DOY0101 - Ingeniería DevOps (Duoc UC)  
> **Evaluación:** Evaluación Parcial 2 (45% ponderación)  
> **Objetivo:** Automatizar el ciclo de vida del microservicio con un pipeline CI/CD en GitHub Actions.

---

## 👤 1. Alex (Seguridad, Quality Gate y Pipeline CI Core)

- [ ] **Configurar Dependabot:** Mantener `.github/dependabot.yml` activo para escaneo semanal de dependencias.
- [ ] **Integrar Análisis SAST:** Conectar SonarCloud (o Snyk) dentro de `.github/workflows/ci.yml`.
- [ ] **Configurar Quality Gate (Bloqueo):** Asegurar que el pipeline falle y bloquee el despliegue si hay vulnerabilidades o tests caídos.
- [ ] **Gobernanza en GitHub:** Activar *Branch Protection Rules* en `main` y `develop` (exigir PR y checks en verde).
- [ ] **Revisión de PRs:** Revisar y aprobar los Pull Requests de Abner y Paulo hacia `develop`.
- [ ] **Redactar Reflexión Individual:** Escribir su reflexión personal y técnica en el `README.md`.

---

## 👤 2. Abner (Contenerización Docker y Pruebas Unitarias)

- [ ] **Optimizar `backend/Dockerfile`:** Convertirlo a *Multi-Stage Build* y definir usuario sin privilegios (`USER node`).
- [ ] **Optimizar `frontend/Dockerfile`:** Convertirlo a *Multi-Stage Build* sobre imagen ligera Alpine.
- [ ] **Revisar `.dockerignore`:** Asegurar que `node_modules`, `.git`, tests y temporales no entren a las imágenes.
- [ ] **Verificar Pruebas Unitarias:** Confirmar que los tests pasen localmente (`npm test` en backend y frontend).
- [ ] **Automatizar Tests en CI:** Asegurar que el pipeline de GitHub Actions ejecute los tests y reporte cobertura.
- [ ] **Agregar Build de Imágenes en CI:** Configurar el paso de construcción Docker en el workflow.
- [ ] **Redactar Reflexión Individual:** Escribir su reflexión personal y técnica en el `README.md`.

---

## 👤 3. Paulo (Orquestación, Despliegue Continuo CD y Documentación)

- [ ] **Mejorar `docker-compose.yml`:**
  - [ ] Definir red bridge aislada para los contenedores.
  - [ ] Agregar `healthcheck` al backend (`/api/health`).
  - [ ] Configurar dependencia condicional en frontend (`condition: service_healthy`).
  - [ ] Probar levantamiento local (`docker-compose up --build -d`).
- [ ] **Implementar Despliegue Automático (CD):**
  - [ ] Agregar job de deploy en `.github/workflows/ci.yml` que se dispare tras aprobar tests y seguridad.
  - [ ] Simular despliegue en runner y asegurar trazabilidad con `$GITHUB_SHA` y tags.
- [ ] **Documentación:** Verificar que el `README.md` detalle la arquitectura y variables.
- [ ] **Redactar Reflexión Individual:** Escribir su reflexión personal y técnica en el `README.md`.

---

## 🏁 4. Hitos de Entrega Final (Equipo)

- [ ] Todos los Pull Requests mergeados en `main` con el pipeline en verde (100% pasando).
- [ ] Las 3 reflexiones individuales redactadas en el `README.md`.
- [ ] Declaración de uso ético de IA incluida.
- [ ] Subir el enlace del repositorio a la plataforma AVA.
- [ ] Enviar el enlace del repositorio por correo al docente dentro del plazo.
