/* ===================================================================
   TOAST — notificaciones no intrusivas (extraído de help.js)
   ===================================================================
   • toast({ type, title, message, duration })
   • tipos: success, warning, error, info
   =================================================================== */
import { Icon } from './icons.js';

const ICONS = { success: 'check', warning: 'triangle-exclamation', error: 'circle-xmark', info: 'circle-info' };
const TITLES = { success: '¡Éxito!', warning: 'Atención', error: 'Error', info: 'Información' };

function container() {
  let c = document.getElementById('toastContainer');
  if (c) return c;
  c = document.createElement('div');
  c.id = 'toastContainer';
  c.className = 'toast-container';
  document.body.appendChild(c);
  return c;
}

export function toast({ type = 'info', title = '', message = '', duration = 3200 } = {}) {
  const c = container();
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.innerHTML = `
    <span class="toast-icon">${Icon.i(ICONS[type] || 'circle-info')}</span>
    <div class="toast-body">
      <div class="toast-title">${(title || TITLES[type] || '')}</div>
      ${message ? `<div class="toast-msg">${message}</div>` : ''}
    </div>
    <button class="toast-close" type="button" aria-label="Cerrar">${Icon.i('xmark')}</button>
  `;
  t.querySelector('.toast-close').addEventListener('click', () => dismiss(t));
  c.appendChild(t);
  const timer = setTimeout(() => dismiss(t), duration);
  t.addEventListener('mouseenter', () => clearTimeout(timer));
}

function dismiss(el) {
  el.classList.add('hide');
  setTimeout(() => el.remove(), 260);
}
