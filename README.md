# Microservicio DevOps - Evaluación Parcial N°1

Repositorio base para la construcción del pipeline DevOps (DOY0101 - Ingeniería DevOps, Duoc UC).  
Este proyecto implementa una arquitectura modular con cliente Frontend, microservicio Backend y automatización de Integración Continua (CI) en la nube mediante GitHub Actions.

---

## 👥 Equipo de Trabajo y Roles

| Integrante | Rol | Responsabilidad Principal |
| :--- | :--- | :--- |
| **Kevin Gallardo** | **Frontend Developer** | Desarrollo de la interfaz de usuario en `frontend/`, consumo de endpoints de API y ejecución de cambios tipo Feature y Hotfix. |
| **Alexsander Rosales** | **Backend Developer** | Desarrollo del microservicio API REST en `backend/`, manejo de lógica de negocio, persistencia y simulación de Feature. |
| **Paulo Rivas** | **DevOps Engineer** | Diseño del repositorio, gobernanza de ramas, configuración de pipeline CI/CD en GitHub Actions y documentación técnica. |

---

## 🎯 Propósito del Proyecto
El objetivo del proyecto es establecer las bases de trabajo colaborativo y control de versiones para el ciclo de vida del software, demostrando:
1. Adopción rigurosa de flujos de trabajo ramificados en la nube.
2. Trazabilidad completa de cambios colaborativos mediante *Pull Requests* y revisiones de código.
3. Automatización de pruebas, sintaxis y validaciones a través de un pipeline de CI en un entorno cloud simulado (GitHub Actions).
4. Cumplimiento de estándares y convenciones de la industria (Conventional Commits, GitFlow, documentación abierta).

---

## 🌿 Justificación del Modelo de Ramificación (IE1)

Para este encargo se seleccionó formalmente el modelo **GitFlow**, tras un análisis comparativo frente a alternativas como **Trunk-Based Development** y **GitHub Flow**:

### Comparativa de Modelos
* **Trunk-Based Development:**
  * *Mecanismo:* Todos los desarrolladores envían cambios frecuentemente directo o mediante ramas muy efímeras hacia la rama principal (`main`/`trunk`).
  * *Ventajas:* Máxima velocidad, minimiza conflictos de integración prolongados, excelente para equipos senior con pruebas automatizadas maduras.
  * *Desventaja en este contexto:* Al no contar con barreras intermedias de estabilización, cualquier commit defectuoso puede comprometer inmediatamente el entorno productivo si no existen *feature flags* consolidados.
* **GitHub Flow:**
  * *Mecanismo:* Basado en una única rama permanente (`main`) y ramas `feature` cortas que se despliegan directamente a producción tras la aprobación del PR.
  * *Ventajas:* Simple y ágil para despliegues continuos (CD).
  * *Desventaja en este contexto:* No contempla de manera nativa la separación formal entre un ciclo de estabilización pre-entrega y la corrección urgente y aislada de fallos en producción.
* **GitFlow (Modelo Seleccionado):**
  * *Mecanismo:* Emplea dos ramas de vida infinita (`main` y `develop`), y ramas auxiliares estrictamente tipificadas (`feature/*`, `hotfix/*`, `release/*`).
  * *Justificación de Selección:*
    1. **Aislamiento por capas:** Permite a Kevin (Frontend) y Alexsander (Backend) trabajar en funcionalidades paralelas (`feature/*`) sin afectar el código que está listo para entrega ni bloquear el trabajo mutuo.
    2. **Ambiente de Integración (`develop`):** Proporciona un entorno controlado donde probar la integración de ambos subsistemas antes de pasar a producción (`main`).
    3. **Respuesta Rápida y Segura a Incidentes (`hotfix/*`):** Permite corregir fallos críticos directamente desde `main` y propagar la solución simultáneamente hacia `develop`, garantizando consistencia absoluta en el historial.

---

## 🏗️ Arquitectura y Estructura de Carpetas (IE5)

```text
├── .github/
│   └── workflows/
│       └── ci.yml               # Configuración del pipeline CI en GitHub Actions
├── frontend/                    # Cliente web / Interfaz de usuario (Kevin Gallardo)
│   ├── public/
│   │   └── index.html           # Vista principal del microservicio
│   ├── src/
│   │   ├── app.js               # Lógica del cliente y consumo de API
│   │   └── style.css            # Estilos y componentes visuales
│   ├── tests/
│   │   └── frontend.test.js     # Pruebas automatizadas de interfaz
│   ├── package.json             # Scripts de inicio, test y dependencias
│   └── README.md                # Guía de ejecución del frontend
├── backend/                     # Servidor API / Lógica de negocio (Alexsander Rosales)
│   ├── src/
│   │   └── server.js            # Servidor HTTP / Endpoints REST
│   ├── tests/
│   │   └── backend.test.js      # Pruebas unitarias de endpoints
│   ├── package.json             # Scripts de servidor y dependencias
│   └── README.md                # Guía de ejecución del backend
├── .gitignore                   # Exclusión de binarios, dependencias y logs
├── CHANGELOG.md                 # Historial de versiones y entregas
├── CODE_OF_CONDUCT.md           # Normas de convivencia del equipo
├── CONTRIBUTING.md              # Estándares de commit, ramas y PRs
├── LICENSE.md                   # Licencia de código abierto MIT
└── README.md                    # Documentación principal del encargo
```

---

## ⚙️ Instrucciones de Instalación y Ejecución

### Requisitos Previos
* [Node.js](https://nodejs.org/) v18+ o superior instalado.
* [Git](https://git-scm.com/) configurado en el sistema local.

### 1. Clonar el repositorio
```bash
git clone https://github.com/iTzAsaro/prueba-devops1.git
cd prueba-devops1
git checkout develop
```

### 2. Ejecutar y Probar el Frontend (Kevin Gallardo)
```bash
cd frontend
# Ejecutar suite de pruebas
npm test
# Iniciar servidor local
npm start
```
Abrir el navegador web en `http://localhost:5000` (o abrir directamente `frontend/public/index.html`).

### 3. Ejecutar y Probar el Backend (Alexsander Rosales)
```bash
cd backend
# Ejecutar suite de pruebas
npm test
# Iniciar servidor del microservicio
npm start
```
El servidor backend escuchará peticiones en `http://localhost:3000/api`.

---

## 🚀 Flujo DevOps y Automatización CI/CD (IE3 & IE4)

### Rol de GitHub Actions en los procesos CI/CD
El archivo [`.github/workflows/ci.yml`](.github/workflows/ci.yml) implementa la etapa de **Integración Continua (CI)** en un entorno Cloud simulado proporcionado por los ejecutores virtuales (*runners*) de GitHub (`ubuntu-latest`).

* **¿Por qué es fundamental en DevOps?**
  1. **Detección temprana de errores (*Shift-Left Testing*):** Cada vez que un desarrollador sube código a `develop`, el pipeline compila y ejecuta las pruebas de frontend y backend, evitando que bugs alcancen etapas avanzadas.
  2. **Control de calidad antes de producción:** Al abrir un *Pull Request* hacia la rama `main`, la ejecución del workflow actúa como una compuerta de calidad (*quality gate*); si el pipeline falla, el merge queda automáticamente bloqueado.
  3. **Trazabilidad:** Genera un registro inmutable en la nube de cada versión validada con su commit y autor correspondiente.

### Eventos Disparadores (*Triggers*)
* **`push` a la rama `develop`:** Valida la integración automática de cada nueva funcionalidad.
* **`pull_request` a la rama `main`:** Certifica que el código destinado a producción es 100% estable y pasó todas las pruebas.

---

## 📋 Bitácora de Trazabilidad Colaborativa (IE2)

La evaluación requiere evidenciar al menos 2 cambios tipo Feature y 1 tipo Hotfix mediante Pull Requests:

| Identificador | Tipo | Rama Origen | Rama Destino | Autor | Descripción del Cambio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PR #1** | Feature | `feature/backend-api-endpoints` | `develop` | Alexsander Rosales | Implementación de endpoints REST y healthcheck del microservicio. |
| **PR #2** | Feature | `feature/frontend-dashboard` | `develop` | Kevin Gallardo | Integración de panel de control interactivo para visualización del microservicio. |
| **PR #3** | Hotfix | `hotfix/fix-client-cors-error` | `main` y `develop` | Kevin Gallardo / Paulo Rivas | Corrección urgente de excepción de conexión cruzada detectada en producción. |

---

## 📖 Convenciones y Guía de Buenas Prácticas (IE5)
Para consultar en detalle las normas de nombrado de ramas, el formato de mensajes de commit ([Conventional Commits](https://www.conventionalcommits.org/)) y la política de revisión de código, remitirse al documento:
👉 **[`CONTRIBUTING.md`](./CONTRIBUTING.md)**

---

## 🤖 Declaración de Uso Ético de Inteligencia Artificial
En cumplimiento de las directrices académicas institucionales de Duoc UC:
* **Herramientas utilizadas:** Asistente de IA (Gemini / Antigravity CLI).
* **Alcance del uso:** Apoyo en la diagramación de flujos, estructura de plantillas de documentación en Markdown y generación de esqueletos base de código.
* **Autoría y validación:** Todos los análisis técnicos, diseño de arquitectura GitFlow, implementación de componentes y reflexiones fueron revisados, validados y adoptados de manera propia por el equipo de estudiantes.

---

## ✍️ Reflexiones Individuales de Aprendizaje (Obligatorias)
*(Sección redactada individualmente por cada integrante sin intervención de IA, detallando su aprendizaje personal y contribución).*

### 1. Reflexión de Kevin Gallardo (Frontend Developer)
> Como Frontend Developer, mi principal desafío fue construir una plataforma de preventa inmersiva (SPA vanilla JS con ES Modules) sin frameworks ni bundlers, lo que me obligó a diseñar un router propio, un store con persistencia en LocalStorage y un design system dark HUD desde cero. La integración del flujo transaccional —customizer, checkout multi-paso con validación Luhn y dashboard de gestión— requirió un manejo de estado cuidadoso para no perder la configuración al recargar. La colaboración bajo GitFlow mediante ramas `feature/*` y Conventional Commits me permitió entregar el trabajo de forma incremental y trazable, abriendo Pull Requests hacia `develop` que pasaron las compuertas de CI. Esta experiencia consolidó mi comprensión de cómo la arquitectura modular frontend y la gobernanza de versiones se complementan para entregar valor de forma segura y colaborativa.
> 
### 2. Reflexión de Alexsander Rosales (Backend Developer)
> En mi rol como Backend Developer, el principal aprendizaje radicó en diseñar un microservicio ligero, modular y resiliente que se integrara de manera transparente con el frontend y con los estándares DevOps del equipo. Implementar la API REST nativa —abarcando endpoints de observabilidad como `/api/health` y `/api/metrics`, junto con la gestión completa del ciclo de vida de preventas (`/api/orders`) y el catálogo de productos— me permitió comprender la importancia crítica de la consistencia en los contratos de datos, el manejo seguro de cabeceras CORS y el logging estructurado de peticiones HTTP. La adopción rigurosa de GitFlow mediante ramas de características (`feature/backend-api-endpoints`) y Conventional Commits facilitó una trazabilidad total del código fuente, mientras que la construcción de una suite exhaustiva de 10 pruebas unitarias e integración garantizó que cada cambio hacia `develop` pasara automáticamente las compuertas de calidad de CI/CD antes de ser integrado. Esta experiencia consolidó mi visión sobre cómo las buenas prácticas de desarrollo ágil y automatización minimizan errores en producción y potencian el trabajo colaborativo en la nube.

### 3. Reflexión de Paulo Rivas (DevOps Engineer)
> Durante este proyecto, el desafío principal como DevOps Engineer fue orquestar el flujo de colaboración para asegurar que el trabajo en paralelo no afectara la estabilidad del código base. Al optar por GitFlow, logramos aislar las nuevas características en ramas `feature/*` e integrarlas en `develop`, brindando un entorno seguro para las pruebas. La configuración del pipeline en GitHub Actions fue clave para la Integración Continua (CI), ya que automatizó la ejecución de las suites de pruebas tanto del frontend como del backend ante cada push a `develop` y en los pull requests hacia `main`. Adicionalmente, el haber dockerizado los microservicios y levantado el entorno con `docker-compose` asegura que cualquier integrante o proceso de CI/CD trabaje bajo las mismas condiciones y dependencias, eliminando el clásico problema de "en mi máquina sí funciona". Esta práctica consolida el trabajo en equipo mediante trazabilidad, automatización y portabilidad.
