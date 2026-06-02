/* ===================================================================
   MODAL — componente modal reutilizable
   ===================================================================
   • Modal.open({ title, body, footer, size, onClose })
   • Modal.confirm({ title, message, danger, onConfirm, onCancel })
   • Modal.close()
   =================================================================== */
import { escapeHtml, $ } from '../core/dom.js';
import { Icon } from './icons.js';

let overlay = null;
let onCloseCb = null;

function ensureOverlay() {
  if (overlay) return overlay;
  overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.id = 'appModal';
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) Modal.close();
  });
  document.body.appendChild(overlay);
  return overlay;
}

export const Modal = {
  open({ title = '', body = '', footer = null, size = '', onClose = null, icon = null } = {}) {
    ensureOverlay();
    onCloseCb = onClose;
    overlay.innerHTML = `
      <div class="modal" style="${size === 'lg' ? 'max-width:640px' : size === 'sm' ? 'max-width:380px' : ''}">
        <div class="modal-header">
          ${icon ? `<span class="modal-icon">${icon}</span>` : ''}
          <h3>${escapeHtml(title)}</h3>
          <button class="modal-close" type="button" aria-label="Cerrar">${Icon.i('xmark')}</button>
        </div>
        <div class="modal-body">${typeof body === 'string' ? body : ''}</div>
        ${footer ? `<div class="modal-footer"></div>` : ''}
      </div>
    `;
    if (typeof body !== 'string') {
      overlay.querySelector('.modal-body').appendChild(body);
    }
    if (footer) {
      const f = overlay.querySelector('.modal-footer');
      if (typeof footer === 'string') f.innerHTML = footer;
      else f.appendChild(footer);
    }
    overlay.querySelector('.modal-close').addEventListener('click', () => Modal.close());
    document.addEventListener('keydown', escHandler);
    overlay.classList.add('open');
  },

  close() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.removeEventListener('keydown', escHandler);
    if (typeof onCloseCb === 'function') onCloseCb();
    onCloseCb = null;
  },

  confirm({ title = '¿Confirmar?', message = '', confirmText = 'Confirmar', cancelText = 'Cancelar', danger = false, onConfirm = null, onCancel = null, icon = null } = {}) {
    const body = `<p style="margin:0 0 8px;color:var(--fg)">${escapeHtml(message)}</p>`;
    const footer = document.createElement('div');
    footer.style.cssText = 'display:flex;gap:8px;justify-content:flex-end';
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn';
    cancelBtn.type = 'button';
    cancelBtn.innerHTML = Icon.label(cancelText, 'xmark');
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn ' + (danger ? 'btn-danger' : 'btn-primary');
    confirmBtn.type = 'button';
    confirmBtn.innerHTML = Icon.label(confirmText, danger ? 'trash' : 'check');
    footer.appendChild(cancelBtn);
    footer.appendChild(confirmBtn);
    cancelBtn.addEventListener('click', () => { Modal.close(); onCancel && onCancel(); });
    confirmBtn.addEventListener('click', async () => {
      confirmBtn.disabled = true;
      try { onConfirm && await onConfirm(); } finally { Modal.close(); }
    });
    Modal.open({ title, body, footer, icon: icon || Icon.i('circle-question'), onClose: () => onCancel && onCancel() });
  },

  prompt({ title = 'Ingresa un valor', label = '', placeholder = '', initial = '', confirmText = 'Aceptar', onConfirm = null }) {
    const body = document.createElement('div');
    body.innerHTML = `
      ${label ? `<label style="display:block;font-size:12px;font-weight:500;color:var(--muted);margin-bottom:6px">${escapeHtml(label)}</label>` : ''}
      <textarea id="appModalPromptInput" class="app-modal-textarea" placeholder="${escapeHtml(placeholder)}" style="width:100%;min-height:90px;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius);font:13px/1.4 var(--font);background:var(--surface);color:var(--fg);resize:vertical"></textarea>
    `;
    const footer = document.createElement('div');
    footer.style.cssText = 'display:flex;gap:8px;justify-content:flex-end';
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn'; cancelBtn.type = 'button';
    cancelBtn.innerHTML = Icon.label('Cancelar', 'xmark');
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn btn-primary'; confirmBtn.type = 'button';
    confirmBtn.innerHTML = Icon.label(confirmText, 'check');
    footer.appendChild(cancelBtn); footer.appendChild(confirmBtn);
    cancelBtn.addEventListener('click', () => Modal.close());
    confirmBtn.addEventListener('click', () => {
      const v = body.querySelector('#appModalPromptInput').value;
      Modal.close();
      onConfirm && onConfirm(v);
    });
    Modal.open({ title, body, footer, icon: Icon.i('pen-to-square') });
    const ta = body.querySelector('#appModalPromptInput');
    ta.value = initial;
    setTimeout(() => ta.focus(), 50);
  }
};

function escHandler(e) {
  if (e.key === 'Escape') Modal.close();
}
