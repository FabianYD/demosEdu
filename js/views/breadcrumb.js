/* ===================================================================
   BREADCRUMB — migas de pan para navegación
   =================================================================== */
import { Icon } from './icons.js';
import { escapeHtml } from '../core/dom.js';

export function renderBreadcrumb(containerEl, items) {
  if (!containerEl) return;
  containerEl.innerHTML = items.map((it, i) => {
    const sep = i > 0 ? `<span class="bc-sep">${Icon.i('chevron-right', 'bc-icon')}</span>` : '';
    if (it.href) {
      return `${sep}<a class="bc-link" href="${it.href}">${Icon.i(it.icon || '', 'bc-icon')} ${escapeHtml(it.label)}</a>`;
    }
    return `${sep}<span class="bc-current">${Icon.i(it.icon || '', 'bc-icon')} ${escapeHtml(it.label)}</span>`;
  }).join('');
}
