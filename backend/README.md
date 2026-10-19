# Microservicio Backend — Plataforma VI CITY (Alexsander Rosales)

Módulo Backend que implementa la API REST y lógica de negocio para la plataforma de preventas VI CITY en el marco de la Evaluación Parcial N°2 de Ingeniería DevOps (DOY0101 - Duoc UC).

> Desarrollado por: **Alexsander Rosales** (Backend Developer)

---

## 🏗️ Arquitectura del Módulo

El microservicio utiliza una arquitectura modular basada en el patrón MVC adaptado para microservicios ligeros en Node.js, sin dependencias externas:

```text
backend/
├── src/
│   ├── config/
│   │   └── constants.js          # Configuración de puertos, CORS, versión
│   ├── controllers/
│   │   ├── catalogController.js  # Lógica de catálogo, plataformas y healthcheck
│   │   └── ordersController.js   # Lógica CRUD de órdenes y métricas DevOps
│   ├── data/
│   │   └── catalog.js            # Datos maestros de plataformas, ediciones y extras
│   ├── middleware/
│   │   ├── cors.js               # Cabeceras CORS para conexión con Frontend
│   │   └── logger.js             # Observabilidad y registro HTTP de peticiones
│   ├── utils/
│   │   └── response.js           # Respuestas HTTP normalizadas y parseo JSON
│   ├── router.js                 # Enrutador HTTP nativo con parámetros dinámicos
│   └── server.js                 # Punto de entrada del servidor HTTP
├── tests/
│   └── backend.test.js           # Suite de 10 pruebas unitarias e integración
├── package.json                  # Scripts de ejecución y metadatos
└── README.md                     # Documentación técnica de la API
```

---

## 🚀 Especificación de Endpoints de la API REST

Prefijo base: `http://localhost:3000/api`

### 1. Observabilidad y Estado (DevOps)
* **`GET /api/health`**
  * Retorna el estado del servicio, uptime en segundos, consumo de memoria y autor.
  * Respuesta exitosa: `HTTP 200 OK`
* **`GET /api/metrics`**
  * Retorna estadísticas en tiempo real: total de preventas, ingresos en CLP, desglose por plataforma y estadísticas de peticiones.
  * Respuesta exitosa: `HTTP 200 OK`

### 2. Catálogo de Preventas
* **`GET /api/catalog`**
  * Retorna el catálogo completo (fechas de precarga, plataformas, ediciones y extras disponibles).
* **`GET /api/platforms`**
  * Retorna el listado de consolas y PC soportadas.
* **`GET /api/editions`**
  * Retorna las ediciones del juego (Standard, Deluxe, Collector's) con sus precios y bonus.

### 3. Gestión de Preventas / Órdenes
* **`GET /api/orders`**
  * Lista todas las preventas registradas.
  * Parámetros opcionales de consulta: `?email=usuario@duocuc.cl` o `?status=confirmada`.
* **`GET /api/orders/:id`**
  * Obtiene los detalles de una orden por ID (`ord-001`) o número de pedido (`VC-2026-8812`).
* **`POST /api/orders`**
  * Registra una nueva preventa validando datos del cliente, compatibilidad de formato/edición y calculando precios totales automáticamente.
  * Respuesta exitosa: `HTTP 201 Created`.
* **`PATCH /api/orders/:id/cancel`**
  * Cancela una orden existente actualizando su estado a `cancelada` y marcando la fecha de cancelación.
  * Respuesta exitosa: `HTTP 200 OK`.
* **`DELETE /api/orders/:id`**
  * Elimina una orden de la persistencia en memoria.

---

## 🧪 Pruebas Automatizadas

El backend incluye una suite completa de 10 pruebas unitarias e integración ejecutadas sobre el propio servidor HTTP:

```bash
cd backend
npm test
```

### Casos de prueba validados:
1. Healthcheck responde 200 con metadata de autor y memoria.
2. Catálogo completo con plataformas y ediciones.
3. Listado de plataformas activas.
4. Consulta de órdenes existentes.
5. Creación de orden con cálculo automático de totales e IVA.
6. Validación de payloads inválidos (HTTP 400).
7. Cancelación de orden (HTTP 200).
8. Métricas globales de DevOps y revenue.
9. Cabeceras CORS para peticiones pre-flight OPTIONS (HTTP 204).
10. Manejador de rutas no encontradas (HTTP 404).

---

## 💻 Ejecución Local

```bash
cd backend
npm start
```
El servidor quedará disponible en `http://localhost:3000`.
