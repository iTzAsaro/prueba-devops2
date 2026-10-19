# VI CITY — Plataforma de Preventa de Videojuegos (Frontend)

Frontend completo para una landing/tienda web de preventa de un videojuego AAA (referencia: GTA VI). Interfaz inmersiva con dark theme HUD/cinemático, navegación SPA fluida y flujo transaccional simulado de alta fidelidad.

> Proyecto académico — Módulo Frontend (DOY0101 - Ingeniería DevOps, Duoc UC).

---

## 🎮 Vistas incluidas

| Ruta (`#`) | Vista | Descripción |
| :--- | :--- | :--- |
| `#/` | **Landing / Showcase** | Hero cinemático con countdown, badges de plataforma, selector de ediciones (Standard/Deluxe/Collector), galería multimedia (trailers + capturas 4K con lightbox), requisitos del sistema y ficha técnica legal. |
| `#/customizer` | **Configurador de compra** | Selector de plataforma, edición, formato (físico/digital) y extras opcionales. Resumen en tiempo real con precio, IVA y bonus. |
| `#/checkout` | **Checkout multi-paso** | Contacto → Envío (condicional a físico) → Pago (tarjeta con validación Luhn, PayPal, billetera) → Revisión con aviso legal de reserva. |
| `#/success` | **Confirmación de reserva** | Número de orden, countdown a precarga, placeholder de clave digital, botones de calendario (Google/iCal) y recibo PDF/imprimir. |
| `#/dashboard` | **Mis Preventas** | Listado de reservas con estado y timeline, edición de dirección/pago, detalle y cancelación con modal de confirmación. |

---

## 🛠️ Stack técnico

- **HTML5** semántico + **CSS3** (design system con variables, glassmorphism, gradientes Vice).
- **Vanilla JavaScript** con **ES Modules** (sin frameworks ni bundlers).
- **SPA** con router hash-based propio y ciclo de vida de limpieza.
- **Estado global** con persistencia en **LocalStorage**.
- **Servidor estático** en Node.js nativo (sin dependencias).
- **Pruebas**: Node.js Test Runner nativo.

```
frontend/
├── public/
│   └── index.html              # Shell HTML (SPA mount point)
├── src/
│   ├── app.js                  # Entrypoint: registra rutas y monta navbar
│   ├── router.js               # Router SPA hash-based
│   ├── style.css               # Design system completo (dark HUD)
│   ├── data/
│   │   └── catalog.js          # Catálogo: ediciones, plataformas, extras, etc.
│   ├── store/
│   │   └── index.js            # Store global con persistencia LocalStorage
│   ├── utils/
│   │   └── ui.js               # Toast, modal, countdown, validaciones, PDF, iCal
│   ├── components/
│   │   ├── navbar.js           # Navbar con cart y navegación
│   │   ├── hero.js             # Hero cinemático + countdown
│   │   ├── editions.js         # Comparativa de ediciones
│   │   ├── gallery.js          # Galería con tabs y lightbox
│   │   └── sysreq.js           # Requisitos y ficha técnica
│   └── pages/
│       ├── home.js             # Landing completa
│       ├── customizer.js       # Configurador
│       ├── checkout.js         # Checkout multi-paso
│       ├── success.js          # Confirmación
│       └── dashboard.js        # Mis preventas
├── tests/
│   └── frontend.test.js
├── server.js                   # Servidor estático Node.js
├── package.json
└── README.md
```

---

## 🚀 Ejecución local

### Requisitos
- Node.js v18+ (soporta `structuredClone` y ES modules en navegador).

### Pasos
```bash
cd frontend
npm start
```
Abrir en el navegador: **http://localhost:5000**

### Pruebas
```bash
npm test
```

---

## ✨ Características de UX

- **Dark theme inmersivo** con paleta Vice (rosa/amarillo/cyan/violeta), grid HUD, scanlines y sol de fondo.
- **Microinteracciones** en botones, tarjetas y chips (hover, glow, scale).
- **Feedback**: notificaciones toast, loaders durante transacciones simuladas, modales con backdrop blur.
- **Validaciones en tiempo real**: email, confirmación, tarjeta (algoritmo de **Luhn**), vencimiento, CVC.
- **Persistencia**: la selección y las órdenes sobreviven a recargas de página (LocalStorage).
- **Responsividad**: mobile-first en checkout, desktop inmersivo en landing.
- **Accesibilidad**: roles ARIA en modales, navegación por teclado (Escape), `aria-live` en toasts.

---

## 📝 Notas

- Las imágenes/tráilers son **mockups con gradientes** (sin assets reales) para evitar dependencias externas.
- El pago es **simulado** — no se procesa ninguna transacción real.
- Rockstar Games no está afiliado a este proyecto académico.
