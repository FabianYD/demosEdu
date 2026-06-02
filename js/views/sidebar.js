/* ===================================================================
   SIDEBAR — barra lateral común
   =================================================================== */
import { Icon } from './icons.js';
import { escapeHtml } from '../core/dom.js';
import { session } from '../repositories/session.js';
import { authService } from '../services/auth.service.js';

const NAV_ITEMS = [
  { key: 'dashboard',       href: 'dashboard.html',       icon: 'table-list',     label: 'Grupos' },
  { key: 'units',           href: 'units.html',           icon: 'book-open',      label: 'Unidades didácticas' },
  { key: 'group-tracking',  href: 'group-tracking.html',  icon: 'chart-column',   label: 'Seguimiento grupal' },
  { key: 'self-eval',       href: 'self-eval.html',       icon: 'user-pen',       label: 'Autoevaluación' },
  { key: 'reports',         href: 'reports.html',         icon: 'file-lines',     label: 'Informes' }
];

export function renderSidebar(containerEl, activeKey) {
  if (!containerEl) return;
  const user = session.current;
  const initials = (user && user.name) ? user.name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase() : 'SD';

  containerEl.innerHTML = `
    <div class="sidebar-header">
      <a href="../index.html" class="logo" title="Inicio">SD</a>
      <div>
        <h1>Sistema Docente</h1>
        <span class="sub">UTN Semilleros 2026</span>
      </div>
    </div>
    <nav class="sidebar-nav">
      ${NAV_ITEMS.map(it => `
        <a class="nav-item ${it.key === activeKey ? 'active' : ''}" href="${it.href}">
          <span class="icon">${Icon.i(it.icon)}</span>
          <span>${escapeHtml(it.label)}</span>
        </a>
      `).join('')}
    </nav>
    <div class="sidebar-footer">
      <div class="user-card">
        <div class="avatar">${escapeHtml(initials)}</div>
        <div class="user-info">
          <div class="user-name">${escapeHtml(user ? user.name : 'Invitado')}</div>
          <div class="user-role">${escapeHtml(user ? (user.role || 'Docente') : '')}</div>
        </div>
        <button class="btn-icon" id="logoutBtn" title="Cerrar sesión" aria-label="Cerrar sesión">${Icon.i('right-from-bracket')}</button>
      </div>
    </div>
  `;

  const logout = containerEl.querySelector('#logoutBtn');
  if (logout) logout.addEventListener('click', () => {
    import('./modal.js').then(({ Modal }) => {
      Modal.confirm({
        title: 'Cerrar sesión',
        message: '¿Seguro que quieres salir?',
        confirmText: 'Salir',
        danger: false,
        icon: Icon.i('right-from-bracket'),
        onConfirm: () => {
          authService.logout();
          window.location.href = 'login.html';
        }
      });
    });
  });
}

export function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const bd = document.getElementById('backdrop');
  if (sb) sb.classList.toggle('open');
  if (bd) bd.classList.toggle('open');
}

window.toggleSidebar = toggleSidebar;
