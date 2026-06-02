/* ===================================================================
   ICONS — FontAwesome 6 helpers
   ===================================================================
   • Icon.i('fa-user') → <i class="fa-solid fa-user"></i>
   • Icon.svg('check')  → <svg ...></svg>  (lucide-style)
   • Icon.label('Editar', 'fa-pen') → '<i> Editar'
   =================================================================== */
import { escapeHtml } from '../core/dom.js';

function fa(name, extra = '') {
  return `<i class="${extra} fa-solid fa-${name}" aria-hidden="true"></i>`;
}

function faRegular(name, extra = '') {
  return `<i class="${extra} fa-regular fa-${name}" aria-hidden="true"></i>`;
}

function faBrand(name, extra = '') {
  return `<i class="${extra} fa-brands fa-${name}" aria-hidden="true"></i>`;
}

/** Devuelve un <i> con el icono FA solicitado. */
export const Icon = {
  i: (name, extra = '') => fa(name, extra),
  regular: (name, extra = '') => faRegular(name, extra),
  brand: (name, extra = '') => faBrand(name, extra),
  /** Icono + texto. */
  label: (text, name, extra = '') =>
    `${fa(name, extra)}<span>${escapeHtml(text)}</span>`,
  /** Solo el nombre legible del icono (para tooltips o aria). */
  text: (name) => name.replace(/-/g, ' ')
};
