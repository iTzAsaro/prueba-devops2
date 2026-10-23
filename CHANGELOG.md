# Registro de Cambios (Changelog)

Todos los cambios notables de este proyecto serán documentados cronológicamente en este archivo.
El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [2.0.0] - 2026-10-23 (Evaluación Parcial N°2 — Pipeline CI/CD Avanzado y DevSecOps)
### Añadido
- Implementación de pipeline CI/CD integral en GitHub Actions con Quality Gates y compuertas de seguridad (Alexsander Rosales).
- Configuración de escaneo de dependencias continuo con Dependabot (`npm` y `github-actions`).
- Análisis estático de código SAST con SonarCloud, mitigación de vulnerabilidades y bloqueo estricto ante no conformidades.
- Optimización de `Dockerfile` para Backend y Frontend mediante Multi-Stage Builds, imágenes Node 20 Alpine y usuario sin privilegios `USER node` (Kevin).
- Exclusión estricta de artefactos, pruebas y temporales mediante `.dockerignore`.
- Generación de reportes de cobertura LCOV automatizados mediante `c8`.
- Orquestación con `docker-compose.yml` multi-servicio con red bridge aislada `vicity_network`, sondeo `healthcheck` y arranque sincronizado con `condition: service_healthy` (Paulo Rivas).
- Despliegue continuo automatizado en entorno simulado con smoke test HTTP y registro inmutable de trazabilidad por `$GITHUB_SHA` (Paulo Rivas).
- Documentación exhaustiva en `README.md`, matrices de rúbrica, evidencias técnicas y reflexiones individuales obligatorias.

---

## [1.0.0] - 2026-09-03 (Línea Base — Versión Inicial del Microservicio)
### Añadido
- Inicialización del repositorio y arquitectura modular Frontend/Backend.
- Módulo Frontend (SPA vanilla con ES Modules).
- Módulo Backend (API REST en Node.js con endpoints `/api/health`, `/api/metrics`, `/api/orders`, `/api/catalog`).
- Suite de 19 pruebas unitarias automatizadas con el test runner nativo de Node.js.
- Flujo básico de CI en GitHub Actions para ejecución de tests.
- Contenerización inicial básica y orquestación simple con Docker Compose.
