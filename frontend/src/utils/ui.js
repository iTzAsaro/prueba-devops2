// ============================================================
// VI CITY — Utilidades UI (toast, modal, countdown, validación)
// ============================================================

export function toast(message, type = 'info', ms = 3200) {
  const stack = document.getElementById('toast-stack');
  if (!stack) return;
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.textContent = message;
  stack.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, ms);
}

export function modal({ title, bodyHtml, onClose, size }) {
  const root = document.getElementById('modal-root');
  const back = document.createElement('div');
  back.className = 'modal-backdrop';
  back.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" ${size ? `data-size="${size}"` : ''}>
      <div class="modal__bar">
        <span class="modal__title">${title}</span>
        <button class="modal__close" aria-label="Cerrar">×</button>
      </div>
      <div class="modal__body">${bodyHtml}</div>
    </div>`;
  root.appendChild(back);
  const close = () => { back.remove(); document.removeEventListener('keydown', onKey); onClose?.(); };
  back.querySelector('.modal__close').onclick = close;
  back.addEventListener('click', e => { if (e.target === back) close(); });
  const onKey = e => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  return { close, root: back };
}

export function confirmDialog({ title, message, confirmText = 'Confirmar', danger = false }) {
  return new Promise(resolve => {
    const m = modal({
      title,
      bodyHtml: `<p style="margin-bottom:18px;color:var(--text-muted)">${message}</p>
        <div class="flex gap">
          <button class="btn btn-dark btn-block" data-act="cancel">Cancelar</button>
          <button class="btn ${danger ? 'btn-danger' : 'btn-primary'} btn-block" data-act="ok">${confirmText}</button>
        </div>`,
      onClose: () => resolve(false),
    });
    m.root.querySelector('[data-act="ok"]').onclick = () => { m.close(); resolve(true); };
    m.root.querySelector('[data-act="cancel"]').onclick = () => { m.close(); resolve(false); };
  });
}

export function countdown(targetDate) {
  const now = Date.now();
  const total = targetDate.getTime() - now;
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const days = Math.floor(total / 86400000);
  const hours = Math.floor((total % 86400000) / 3600000);
  const minutes = Math.floor((total % 3600000) / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  return { days, hours, minutes, seconds, done: false };
}

export function startCountdown(targetDate, render) {
  const tick = () => render(countdown(targetDate));
  tick();
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}

export function renderCountdownUnits(c) {
  return ['days', 'hours', 'minutes', 'seconds']
    .map(k => `<div class="countdown__unit"><span class="countdown__num">${String(c[k]).padStart(2, '0')}</span><span class="countdown__label">${k === 'days' ? 'Días' : k === 'hours' ? 'Horas' : k === 'minutes' ? 'Min' : 'Seg'}</span></div>`)
    .join('');
}

// ===== Validaciones =====
export function validateEmail(v) {
  if (typeof v !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

export function validateCardNumber(v) {
  if (!v || typeof v !== 'string') return false;
  const digits = v.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  // Luhn
  let sum = 0, alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = +digits[i];
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n; alt = !alt;
  }
  return sum % 10 === 0;
}

export function detectCardBrand(v) {
  if (!v || typeof v !== 'string') return 'card';
  const d = v.replace(/\D/g, '');
  if (/^4/.test(d)) return 'visa';
  if (/^5[1-5]/.test(d)) return 'mastercard';
  if (/^3[47]/.test(d)) return 'amex';
  if (/^6/.test(d)) return 'discover';
  return 'card';
}

export function validateExpiry(v) {
  if (!v || typeof v !== 'string') return false;
  const m = v.trim().match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const month = +m[1], year = 2000 + +m[2];
  if (month < 1 || month > 12) return false;
  const exp = new Date(year, month, 0, 23, 59, 59);
  return exp > new Date();
}

export function validateCVC(v) {
  if (!v || typeof v !== 'string') return false;
  return /^\d{3,4}$/.test(v.trim());
}

export function formatCardNumber(v) {
  if (!v || typeof v !== 'string') return '';
  const d = v.replace(/\D/g, '').slice(0, 19);
  return d.replace(/(.{4})/g, '$1 ').trim();
}

export function formatExpiry(v) {
  const d = v.replace(/\D/g, '').slice(0, 4);
  if (d.length <= 2) return d;
  return d.slice(0, 2) + '/' + d.slice(2);
}

// ===== Loader helpers =====
export function withLoader(btn, fn) {
  return async (...args) => {
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="loader"></span> Procesando...';
    try { return await fn(...args); }
    finally { btn.disabled = false; btn.innerHTML = orig; }
  };
}

export function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ===== PDF / Print receipt =====
export function printReceipt(orderHtml) {
  const w = window.open('', '_blank', 'width=720,height=900');
  if (!w) return;
  w.document.write(`<!DOCTYPE html><html><head><title>Recibo VI CITY</title>
    <style>
      body{font-family:system-ui,sans-serif;padding:32px;color:#111;max-width:600px;margin:auto}
      h1{color:#ff2d6f}table{width:100%;border-collapse:collapse;margin:16px 0}
      td,th{padding:8px;border-bottom:1px solid #ddd;text-align:left}.muted{color:#666}
    </style></head><body>${orderHtml}<script>window.print()<\/script></body></html>`);
  w.document.close();
}

// ===== Calendar =====
export function googleCalendarLink({ title, start, end, description = '' }) {
  const fmt = d => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: description,
    location: 'Vice City',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function icalDownload({ title, start, end, description = '' }) {
  const fmt = d => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//VICITY//EN',
    'BEGIN:VEVENT', `UID:${Date.now()}@vicity`,
    `DTSTAMP:${fmt(new Date())}`, `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`,
    `SUMMARY:${title}`, `DESCRIPTION:${description}`, 'LOCATION:Vice City',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'gta6-lanzamiento.ics'; a.click();
  URL.revokeObjectURL(url);
}

// ===== Misc =====
export function uid(prefix = 'ORD') {
  const rand = (typeof crypto !== 'undefined' && crypto.getRandomValues)
    ? (crypto.getRandomValues(new Uint32Array(1))[0] % 1000).toString().padStart(3, '0')
    : Date.now().toString().slice(-3);
  return `${prefix}-${Date.now().toString(36).toUpperCase().slice(-6)}${rand}`;
}

export function formatDate(d, opts = { year: 'numeric', month: '2-digit', day: '2-digit' }) {
  return new Intl.DateTimeFormat('es-CL', opts).format(d);
}

export function statusBadge(status) {
  const map = {
    reservada:   { cls: 'badge-warn',   label: 'Reservada' },
    'pago-procesado': { cls: 'badge-cyan', label: 'Pago procesado' },
    'listo-precarga': { cls: 'badge-accent', label: 'Listo para precarga' },
    enviada:     { cls: 'badge-ok',     label: 'Enviada' },
    cancelada:   { cls: 'badge-danger', label: 'Cancelada' },
  };
  const s = map[status] || { cls: 'badge-muted', label: status };
  return `<span class="badge ${s.cls}">● ${s.label}</span>`;
}
