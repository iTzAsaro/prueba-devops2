# Registro de Cambios (Changelog)

Todos los cambios notables de este proyecto serán documentados cronológicamente en este archivo.
El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [2.0.0-dev] - 2026-10-18 (Evaluación Parcial N°2 - En desarrollo)
### Planificado / En progreso
- Implementación de pipeline CI/CD avanzado en GitHub Actions con Quality Gates (Alexsander Rosales).
- Configuración de escaneo de seguridad automatizado con Dependabot y análisis SAST (SonarCloud/Snyk).
- Optimización de `Dockerfile` para Backend y Frontend mediante Multi-Stage Builds y usuario sin privilegios `USER node` (Abner).
- Orquestación con `docker-compose.yml` avanzada, incorporando dependencias ordenadas por `healthcheck` y red interna (Paulo Rivas).
- Despliegue continuo automatizado en entorno simulado con trazabilidad semántica y commit SHA (Paulo Rivas).

---

## [1.0.0] - 2026-09-03 (Línea Base — Evaluación Parcial N°1)
### Añadido
- Inicialización del repositorio y arquitectura modular Frontend/Backend.
- Módulo Frontend (SPA vanilla con ES Modules).
- Módulo Backend (API REST en Node.js con endpoints `/api/health`, `/api/metrics`, `/api/orders`, `/api/catalog`).
- Suite de 19 pruebas unitarias automatizadas con el test runner nativo de Node.js.
- Flujo básico de CI en GitHub Actions para ejecución de tests.
- Contenerización inicial básica y orquestación simple con Docker Compose.
