# Guía de Contribución y Buenas Prácticas DevOps (CONTRIBUTING.md)

Bienvenido a la guía de colaboración del proyecto. Este documento define los estándares obligatorios para el control de versiones, flujos de trabajo, convenciones de nombres y procesos de revisión dentro del equipo.

---

## 1. Roles y Responsabilidades
* **Alexsander Rosales**: Tech Lead & Security / CI Pipeline Core (Gobernanza de CI/CD, Dependabot, análisis SAST y Quality Gates).
* **Abner**: Container & Testing Automation Engineer (Contenerización Multi-Stage en Docker, suite de pruebas y cobertura).
* **Paulo Rivas**: DevOps & Orchestration Engineer (Orquestación con Docker Compose, despliegue continuo CD y documentación técnica).

---

## 2. Estrategia de Ramificación (GitFlow)
Adoptamos el modelo **GitFlow**. Ningún desarrollador debe realizar *push* directo a las ramas protegidas (`main` y `develop`).

### Definición de Ramas
* **`main`**: Contiene únicamente código listo para producción y despliegues estables. Solo recibe cambios mediante *Pull Requests* aprobados desde `develop` (para releases) o desde `hotfix/*` (para emergencias).
* **`develop`**: Rama base de integración continua. Agrupa las características completadas para el siguiente ciclo.
* **`feature/<nombre-descriptivo>`**: Ramas temporales donde se desarrollan nuevas funcionalidades. Nacen de `develop` y se reintegran exclusivamente en `develop` vía *Pull Request*.
  * *Ejemplo:* `feature/frontend-dashboard`, `feature/backend-api-endpoints`.
* **`hotfix/<nombre-descriptivo>`**: Ramas destinadas a solucionar fallos críticos e inmediatos detectados en producción. Nacen directamente de `main` y deben fusionarse tanto a `main` como a `develop`.
  * *Ejemplo:* `hotfix/fix-client-cors-error`, `hotfix/fix-auth-timeout`.

---

## 3. Convención de Mensajes de Commit (Conventional Commits)
Se debe seguir la especificación [Conventional Commits v1.0.0](https://www.conventionalcommits.org/).

### Estructura general
```text
<tipo>(<ámbito opcional>): <descripción concisa en modo imperativo>

[cuerpo opcional detallando el porqué del cambio]

[pie de página opcional: referencias a issues o breaking changes]
```

### Tipos de commits permitidos
* **`feat`**: Nueva funcionalidad para el usuario o sistema (ej. `feat(backend): add authentication endpoints`).
* **`fix`**: Corrección de un fallo o error (ej. `fix(frontend): resolve broken link on dashboard`).
* **`docs`**: Cambios exclusivos en documentación (ej. `docs: update setup instructions in README`).
* **`style`**: Formato, espacios, comas, sin cambio en lógica de código (ej. `style: format CSS rules with Prettier`).
* **`refactor`**: Modificación de código que no corrige un bug ni añade una función nueva (ej. `refactor(backend): clean database query logic`).
* **`test`**: Creación o ajuste de pruebas unitarias o de integración (ej. `test(frontend): add unit tests for navbar component`).
* **`chore`**: Tareas de mantenimiento, dependencias o tooling (ej. `chore: update npm build script`).
* **`ci`**: Modificaciones en archivos de configuración de GitHub Actions (ej. `ci: add automated linting step`).

---

## 4. Proceso de Pull Requests y Merge
1. **Sincronización previa:** Antes de abrir un PR, actualizar la rama local con `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/<mi-rama>
   git merge develop
   ```
2. **Creación del Pull Request:**
   - Título claro en formato convencional.
   - Descripción detallada: qué se hizo, cómo probarlo y evidencia (capturas o logs).
   - Asignar a Paulo Rivas (o al compañero de par) como *Reviewer*.
3. **Validación Automática (CI Pipeline):**
   - El pipeline en GitHub Actions debe ejecutarse automáticamente y resultar en estado exitoso (verde).
4. **Revisión de Código (Code Review Checklist):**
   - [ ] ¿El código sigue los estándares de calidad y no rompe tests existentes?
   - [ ] ¿Los commits son atómicos y respetan Conventional Commits?
   - [ ] ¿Se actualizaron pruebas o documentación si fue necesario?
5. **Estrategia de Merge:**
   - Fusión mediante **Create a Merge Commit** o **Squash and Merge** preservando la trazabilidad del trabajo del desarrollador.

---

## 5. Estructura del Repositorio
* `frontend/`: Código fuente de la interfaz de usuario, dependencias (`package.json`) y pruebas de cliente.
* `backend/`: Código del microservicio, rutas de la API, controladores y pruebas de servidor.
* `.github/workflows/`: Definición de flujos automatizados de CI/CD para GitHub Actions.
* `docs/`: Diagramas de flujo, documentación técnica adicional y bitácoras.
