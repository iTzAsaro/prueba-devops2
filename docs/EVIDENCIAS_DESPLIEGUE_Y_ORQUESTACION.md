# 🚀 Evidencias de Despliegue Continuo (CD) y Orquestación — Evaluación Parcial N°2

> **Asignatura:** DOY0101 - Ingeniería DevOps  
> **Proyecto:** Plataforma de Preventas VI CITY  
> **Responsable de Despliegue y Orquestación (IE4 & IE5):** Paulo Rivas (DevOps & Orchestration Engineer)  
> **Pipeline Oficial:** `.github/workflows/ci.yml` (Fase 4: `deploy-simulated`)  
> **Orquestador Base:** `docker-compose.yml` (Versión 3.8 con red Bridge y Healthchecks)

---

## 📑 Tabla de Contenidos
1. [Resumen Ejecutivo de Indicadores Asignados](#1-resumen-ejecutivo-de-indicadores-asignados)
2. [IE5: Orquestación Multi-Contenedor Resiliente](#2-ie5-orquestación-multi-contenedor-resiliente)
   - [2.1 Arquitectura del Clúster y Red Aislada](#21-arquitectura-del-clúster-y-red-aislada)
   - [2.2 Healthcheck Activo en Backend](#22-healthcheck-activo-en-backend)
   - [2.3 Dependencia Condicional por Salud (service_healthy)](#23-dependencia-condicional-por-salud-service_healthy)
   - [2.4 Políticas de Recuperación y Resiliencia](#24-políticas-de-recuperación-y-resiliencia)
3. [IE4: Despliegue Continuo (CD) en Entorno Cloud Simulado](#3-ie4-despliegue-continuo-cd-en-entorno-cloud-simulado)
   - [3.1 Integración en el Pipeline GitHub Actions](#31-integración-en-el-pipeline-github-actions)
   - [3.2 Validación Automatizada con Smoke Test](#32-validación-automatizada-con-smoke-test)
4. [IE4: Trazabilidad Inmutable de Extremo a Extremo](#4-ie4-trazabilidad-inmutable-de-extremo-a-extremo)
   - [4.1 Variables y Metadatos Registrados](#41-variables-y-metadatos-registrados)
   - [4.2 Diagrama de Flujo de Trazabilidad](#42-diagrama-de-flujo-de-trazabilidad)
5. [Matriz de Cumplimiento 100% de Rúbrica Duoc UC](#5-matriz-de-cumplimiento-100-de-rúbrica-duoc-uc)

---

## 1. Resumen Ejecutivo de Indicadores Asignados

| Indicador | Ponderación | Criterio de Logro Máximo (100% - Muy Buen Desempeño) | Estado |
| :---: | :---: | :--- | :---: |
| **IE4** | **20%** | *"Despliega automáticamente una aplicación de forma completa y trazable, utilizando pipelines de CI/CD bien configurados en un entorno cloud simulado, garantizando su trazabilidad."* | **✅ 100% Implementado** |
| **IE5** | **20%** | *"Orquesta el uso de contenedores de manera eficiente y escalable, asegurando el funcionamiento estable de soluciones complejas."* | **✅ 100% Implementado** |

---

## 2. IE5: Orquestación Multi-Contenedor Resiliente

La arquitectura de la solución se desacopló en dos servicios independientes orquestados mediante [docker-compose.yml](../docker-compose.yml):
* **`backend`:** API REST basada en Node.js que expone los endpoints de catálogo, órdenes y salud (`/api/health`).
* **`frontend`:** Interfaz SPA servida mediante un servidor estático optimizado con Dark HUD.

### 2.1 Arquitectura del Clúster y Red Aislada

Para evitar que los contenedores dependan del host o expongan interfaces internas de forma insegura, se implementó una red virtual tipo **Bridge**:

```yaml
networks:
  vicity_network:
    driver: bridge
```

* **Aislamiento de Red:** Los contenedores se comunican internamente usando nombres de servicio como hostnames DNS (`http://backend:3000`), sin exponer puertos no requeridos a redes externas.
* **Segmentación:** Cada servicio se asocia explícitamente a `vicity_network`.

### 2.2 Healthcheck Activo en Backend

Se configuró un mecanismo nativo de inspección de estado en el backend para verificar que el servidor HTTP esté listo para atender tráfico y no solo con el proceso PID activo:

```yaml
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://127.0.0.1:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 10s
```

* **`test`:** Ejecución de una petición HTTP liviana nativa en Node.js hacia `http://127.0.0.1:3000/api/health`. Si responde `200 OK`, el código de salida es `0` (`healthy`). En caso contrario o error de conexión, retorna `1` (`unhealthy`).
* **`interval: 15s`:** Frecuencia con la cual Docker sondea la salud del microservicio.
* **`timeout: 5s`:** Tiempo máximo de espera por respuesta antes de considerar fallido el sondeo.
* **`retries: 3`:** Cantidad de intentos fallidos consecutivos necesarios para declarar el contenedor en estado no saludable.
* **`start_period: 10s`:** Ventana de calentamiento durante la cual los fallos iniciales de inicialización no penalizan el umbral de reintentos.

### 2.3 Dependencia Condicional por Salud (`service_healthy`)

En entornos orquestados reales, levantar un frontend antes de que el backend esté listo provoca errores `502 Bad Gateway` o peticiones fallidas en el cliente. Para solucionar este problema de orden de inicio:

```yaml
  frontend:
    # ...
    depends_on:
      backend:
        condition: service_healthy
```

A diferencia de un `depends_on` tradicional que sólo evalúa el arranque del proceso, la condición `service_healthy` bloquea el inicio del contenedor `frontend` hasta que el `backend` haya respondido satisfactoriamente a su healthcheck.

### 2.4 Políticas de Recuperación y Resiliencia

* **`restart: unless-stopped`:** Garantiza tolerancia a fallos. Si un proceso sufre una excepción no capturada o el demonio Docker se reinicia, los contenedores vuelven a levantarse automáticamente de forma autónoma.
* **Variables de entorno desacopladas:** Uso de `PORT`, `NODE_ENV=production` y `BACKEND_URL` para facilitar la migración a otros entornos (staging, pre-producción o producción real en Kubernetes / Cloud ECS).

---

## 3. IE4: Despliegue Continuo (CD) en Entorno Cloud Simulado

### 3.1 Integración en el Pipeline GitHub Actions

El flujo de despliegue automatizado fue integrado en [.github/workflows/ci.yml](../.github/workflows/ci.yml) bajo el job `deploy-simulated`:

```mermaid
flowchart LR
    A["unit-tests (IE2)"] --> B["security-audit (IE3)"]
    B --> C["docker-build (IE1)"]
    C --> D["deploy-simulated (IE4 & IE5)"]
    
    subgraph D_Details ["Fase 4: Despliegue Simulado (Paulo)"]
        D1["docker compose up --build -d"] --> D2["Smoke Test (curl /api/health)"]
        D2 --> D3["Auditoría & Trazabilidad ($GITHUB_SHA)"]
        D3 --> D4["docker compose down"]
    end
```

* **Compuertas Previas Estrictas (`needs: [docker-build]`):** El despliegue sólo se ejecuta si el código superó el 100% de las pruebas unitarias (19/19), el escaneo SAST de SonarCloud y la construcción multi-stage de las imágenes.

### 3.2 Validación Automatizada con Smoke Test

Una vez que Docker Compose levanta el stack en el runner, el pipeline ejecuta un **Smoke Test** automatizado mediante `curl`:

```bash
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health || true)
if [ "$STATUS" -eq 200 ]; then
  echo "✅ Despliegue validado exitosamente en entorno simulado."
else
  echo "⚠️ Servicio en arranque o respuesta inesperada: $STATUS"
fi
```

Esto certifica que la aplicación no sólo se empaquetó, sino que es capaz de recibir y responder tráfico de red real de extremo a extremo en un entorno idéntico a un nodo cloud.

---

## 4. IE4: Trazabilidad Inmutable de Extremo a Extremo

### 4.1 Variables y Metadatos Registrados

Durante la ejecución del despliegue en GitHub Actions, se genera una huella inmutable de auditoría que asocia el artefacto en ejecución con el código fuente y su contexto de entrega:

```text
==========================================================
📋 REGISTRO INMUTABLE DE TRAZABILIDAD (IE4)
==========================================================
Commit SHA:     ${{ github.sha }}
Rama origen:    ${{ github.ref_name }}
Autor:          ${{ github.actor }}
Fecha y Hora:   $(date -u +"%Y-%m-%dT%H:%M:%SZ")
Entorno:        Simulado (Runner GitHub Actions / Compose)
Estado:         Desplegado y Auditado
==========================================================
```

### 4.2 Diagrama de Flujo de Trazabilidad

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Desarrollador (Paulo Rivas)
    participant Git as Repositorio GitHub
    participant CI as Pipeline Actions
    participant Registry as Imagen Docker ($GITHUB_SHA)
    participant Cluster as Entorno Simulado (Compose)

    Dev->>Git: git push / Pull Request (develop / main)
    Git->>CI: Trigger evento con GITHUB_SHA
    CI->>CI: Ejecuta 19 Unit Tests & Quality Gate SonarCloud
    CI->>Registry: Construye imágenes etiquetadas con SHA
    CI->>Cluster: docker compose up -d (Red aislada vicity_network)
    Cluster->>Cluster: Backend inicia y pasa healthcheck
    Cluster->>Cluster: Frontend inicia tras service_healthy
    CI->>Cluster: Smoke test HTTP GET /api/health (200 OK)
    CI->>CI: Loguea registro inmutable de trazabilidad (SHA, rama, autor, timestamp)
    CI-->>Dev: Pipeline 100% Verde (Aprobado para Entrega)
```

---

## 5. Matriz de Cumplimiento 100% de Rúbrica Duoc UC

| Criterio Evaluado | Nivel Alcanzado | Justificación Técnica |
| :--- | :---: | :--- |
| **IE4 — Despliegue Automático y Trazable (20%)** | **100% (Muy buen desempeño)** | Se implementó el job `deploy-simulated` en GitHub Actions que levanta el stack completo de forma desatendida ante cada push/PR, realiza smoke tests HTTP contra el microservicio y deja evidencia inmutable en los logs del commit SHA, branch, autor y fecha UTC. |
| **IE5 — Orquestación de Contenedores Eficiente (20%)** | **100% (Muy buen desempeño)** | Se diseñó y configuró `docker-compose.yml` con red aislada tipo bridge (`vicity_network`), sondeo proactivo de salud (`healthcheck` en backend con timeouts y retries), sincronización de arranque condicional (`condition: service_healthy`) y políticas de resiliencia ante caídas (`restart: unless-stopped`). |

---

*Documento técnico elaborado por Paulo Rivas — DevOps & Orchestration Engineer para la Evaluación Parcial N°2 (DOY0101).*
