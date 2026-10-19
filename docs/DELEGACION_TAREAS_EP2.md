# 📋 Checklist de Cumplimiento 100% Rúbrica — EP2 DevOps

> **Asignatura:** DOY0101 - Ingeniería DevOps (Duoc UC)  
> **Evaluación:** Evaluación Parcial 2 (Ponderación: 45%)  
> **Objetivo:** Garantizar el **100% de logro ("Muy buen desempeño")** en los 5 Indicadores de Evaluación (IE1 a IE5).

---

## 🎯 Matriz de Rúbrica y Asignación de Indicadores

| Indicador | % Pauta | Criterio para Logro Máximo (100% - "Muy buen desempeño") | Responsable Principal |
| :---: | :---: | :--- | :---: |
| **IE1** | **20%** | *"Incorpora contenedores de manera eficaz, seleccionando imágenes optimizadas y configuraciones adecuadas, lo que facilita significativamente el trabajo con aplicaciones modernas en entornos de nube."* | **Abner** |
| **IE2** | **20%** | *"Integra pruebas automatizadas que cubren casos críticos y se ejecutan correctamente en los pipelines, cumpliendo completamente con las políticas de calidad del proyecto."* | **Abner** |
| **IE3** | **20%** | *"Ajusta de manera precisa los parámetros de escalabilidad y seguridad en el pipeline, alineándose con estándares de desempeño y gobernanza en entornos con contenedores."* | **Alex** |
| **IE4** | **20%** | *"Despliega automáticamente una aplicación de forma completa y trazable, utilizando pipelines de CI/CD bien configurados en un entorno cloud simulado, garantizando su trazabilidad."* | **Paulo** |
| **IE5** | **20%** | *"Orquesta el uso de contenedores de manera eficiente y escalable, asegurando el funcionamiento estable de soluciones complejas."* | **Paulo** |

---

## 👤 1. Alex — Responsable de IE3 (Seguridad & Gobernanza - 20%)

> **Meta Rúbrica 100%:** Ajuste preciso de seguridad, gobernanza del repositorio y bloqueo estricto del pipeline.

- [x] **[IE3 - 100%] Dependabot activo:** Mantener `.github/dependabot.yml` con escaneo semanal para `backend` (npm), `frontend` (npm) y `github-actions`.
- [x] **[IE3 - 100%] Análisis SAST automatizado:** Integrar SonarCloud o Snyk en `.github/workflows/ci.yml` y `sonar-project.properties` para analizar vulnerabilidades y deuda técnica.
- [x] **[IE3 - 100%] Quality Gate con Bloqueo Estricto:** Configurar el pipeline para que falle (`exit 1` / build rojo) y detenga el despliegue si se detectan vulnerabilidades altas/críticas o caída de calidad.
- [x] **[IE3 - 100%] Gestión Segura de Secretos:** Configurar soporte para tokens (`SONAR_TOKEN`, `SNYK_TOKEN`) mediante GitHub Repository Secrets con validación segura.
- [x] **[IE3 - 100%] Gobernanza de Ramas:** Activar *Branch Protection Rules* en `main` y `develop` (requerir PR aprobado y que todos los checks de CI pasen obligatoriamente).
- [ ] **[IE3 - 100%] Revisión de PRs:** Auditar y aprobar los Pull Requests de Abner y Paulo cuando envíen sus cambios a `develop`.
- [x] **[Formal] Reflexión Individual:** Redactada en el `README.md` la reflexión personal y técnica sobre DevSecOps y gobernanza.

---

## 👤 2. Abner — Responsable de IE1 e IE2 (Contenedores & Pruebas - 40%)

> **Meta Rúbrica 100%:** Contenedores optimizados de estándar cloud y pruebas automatizadas de casos críticos en CI.

- [ ] **[IE1 - 100%] Dockerfile Multi-Stage en Backend:** Separar etapas de construcción (`builder`) y ejecución (`production`), usando imagen ligera Alpine.
- [ ] **[IE1 - 100%] Hardening y Seguridad en Contenedor:** Asignar usuario sin privilegios (`USER node`) para evitar ejecución como root.
- [ ] **[IE1 - 100%] Dockerfile Multi-Stage en Frontend:** Implementar multi-stage optimizado para servir la SPA en imagen liviana.
- [ ] **[IE1 - 100%] Exclusión Estricta con `.dockerignore`:** Garantizar que `node_modules`, `.git`, `.github`, tests y archivos temporales queden fuera de la imagen final.
- [ ] **[IE1 - 100%] Job de Build en GitHub Actions:** Configurar en el pipeline el paso que valida la construcción exitosa de ambas imágenes Docker (`docker build`).
- [ ] **[IE2 - 100%] Cobertura de Casos Críticos:** Verificar que las suites unitarias cubran flujos clave (healthcheck, cálculo de precios, validación de payloads erróneos 400, cancelación y rutas 404).
- [ ] **[IE2 - 100%] Pruebas en CI sin Fallas:** Asegurar que los 10 tests de backend y 9 de frontend se ejecuten automáticamente en el runner de GitHub Actions ante push y PR.
- [ ] **[IE2 - 100%] Generación de Cobertura:** Exportar métricas de cobertura de código para que alimenten el análisis de calidad.
- [ ] **[Formal] Reflexión Individual:** Redactar en el `README.md` su reflexión personal sin IA explicando su contribución en Docker y testing.

---

## 👤 3. Paulo — Responsable de IE4 e IE5 (Despliegue & Orquestación - 40%)

> **Meta Rúbrica 100%:** Despliegue automático con trazabilidad completa y orquestación resiliente multi-contenedor.

- [ ] **[IE5 - 100%] Orquestación Multi-Servicio:** Definir en `docker-compose.yml` la coexistencia de `backend` y `frontend`.
- [ ] **[IE5 - 100%] Red Aislada (Bridge Network):** Crear una red dedicada (`vicity_network`) para comunicación interna segura entre servicios.
- [ ] **[IE5 - 100%] Healthchecks Activos:** Configurar verificación periódica de salud en el backend con `interval`, `timeout`, `retries` y `start_period`.
- [ ] **[IE5 - 100%] Dependencia Condicional por Salud:** Configurar en el frontend `depends_on: backend: condition: service_healthy` para garantizar arranque en orden.
- [ ] **[IE5 - 100%] Políticas de Resiliencia:** Incluir políticas de reinicio automático (`restart: unless-stopped`) y variables de entorno desacopladas.
- [ ] **[IE4 - 100%] Job de Despliegue Automático (CD):** Agregar etapa de deploy en GitHub Actions que se ejecute solo si los tests y escaneos de seguridad pasaron exitosamente.
- [ ] **[IE4 - 100%] Entorno Cloud Simulado:** Simular el despliegue automático levantando los contenedores en el runner de GitHub Actions y validando conectividad con un smoke test.
- [ ] **[IE4 - 100%] Trazabilidad de Extremo a Extremo:** Registrar en los logs de despliegue el commit SHA (`$GITHUB_SHA`), tag semántico, rama y timestamp.
- [ ] **[IE4 - 100%] Documentación de Trazabilidad y Calidad:** Explicar en el `README.md` cómo el pipeline asegura la trazabilidad desde el commit hasta el despliegue.
- [ ] **[Formal] Reflexión Individual:** Redactar en el `README.md` su reflexión personal sin IA explicando su contribución en orquestación y CD.

---

## 🏁 4. Hitos de Entrega Formal (100% Requisitos Institucionales)

- [ ] **Pipeline 100% Verde:** Todos los Pull Requests mergeados en `main` pasando todas las compuertas de GitHub Actions.
- [ ] **3 Reflexiones Individuales Obligatorias:** Escritas de forma personal por Alex, Abner y Paulo en el `README.md`.
- [ ] **Declaración de Uso Ético de IA:** Incluida formalmente en el `README.md`.
- [ ] **Subida a Plataforma AVA:** Subir el enlace público del repositorio de GitHub dentro del plazo.
- [ ] **Envío de Correo al Docente:** Notificar formalmente al profesor con el enlace del repositorio.
