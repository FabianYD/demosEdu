/* ===================================================================
   SISTEMA DE AYUDA GUIADA — Shepherd.js
   Sistema Docente UTN Semilleros 2026
   ----------------------------------------------------------------
   • Botón flotante (?) visible en todas las páginas
   • Tour guiado que explica qué hace cada botón/sección
   • Toasts (notificaciones) para feedback de acciones
   • Atajos de teclado: H = ayuda, ESC = cerrar tour
   =================================================================== */
(function () {
  'use strict';

  var SHEPHERD_JS  = 'https://cdn.jsdelivr.net/npm/shepherd.js@11.2.0/dist/js/shepherd.min.js';
  var SHEPHERD_CSS = 'https://cdn.jsdelivr.net/npm/shepherd.js@11.2.0/dist/css/shepherd.css';

  /* ===================================================================
     1. INYECTAR ESTILOS — botón flotante, toasts, tema Shepherd
     =================================================================== */
  function injectStyles() {
    var s = document.createElement('style');
    s.id = 'help-system-styles';
    s.textContent = [
      /* --- Botón flotante de ayuda --- */
      '.help-fab{position:fixed;bottom:24px;right:24px;width:54px;height:54px;border-radius:50%;background:var(--accent,#3b6cf2);color:#fff;border:none;cursor:pointer;font:600 24px/1 system-ui;box-shadow:0 8px 24px rgba(0,0,0,.18);z-index:9000;display:grid;place-items:center;transition:transform .2s,box-shadow .2s;}',
      '.help-fab:hover{transform:scale(1.08) rotate(-6deg);box-shadow:0 12px 30px rgba(0,0,0,.24);}',
      '.help-fab:active{transform:scale(.95);}',
      '.help-fab.pulse::after{content:"";position:absolute;inset:0;border-radius:50%;background:var(--accent,#3b6cf2);opacity:.45;animation:help-pulse 2.2s ease-out infinite;}',
      '@keyframes help-pulse{0%{transform:scale(1);opacity:.45}100%{transform:scale(1.9);opacity:0}}',
      '.help-fab-label{position:fixed;bottom:34px;right:88px;background:#1a1a1a;color:#fff;font:500 12px/1 system-ui;padding:6px 10px;border-radius:6px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .2s;z-index:9000;}',
      '.help-fab:hover + .help-fab-label{opacity:.9;}',

      /* --- Toasts --- */
      '.toast-container{position:fixed;top:20px;right:20px;z-index:9500;display:flex;flex-direction:column;gap:8px;pointer-events:none;}',
      '.toast{pointer-events:auto;background:var(--surface,#fff);border:1px solid var(--border,#e6e6e6);border-left:4px solid var(--accent,#3b6cf2);border-radius:8px;padding:12px 16px;min-width:240px;max-width:360px;box-shadow:0 8px 24px rgba(0,0,0,.08);font:500 13px/1.4 system-ui;color:var(--fg,#1a1a1a);display:flex;align-items:flex-start;gap:10px;animation:toast-in .35s cubic-bezier(.16,1,.3,1) both;}',
      '.toast.success{border-left-color:#2da869;}',
      '.toast.success .toast-icon{color:#2da869;}',
      '.toast.warning{border-left-color:#d9a300;}',
      '.toast.warning .toast-icon{color:#d9a300;}',
      '.toast.error{border-left-color:#d24a4a;}',
      '.toast.error .toast-icon{color:#d24a4a;}',
      '.toast.info .toast-icon{color:var(--accent,#3b6cf2);}',
      '.toast .toast-icon{font-size:18px;line-height:1;flex-shrink:0;margin-top:1px;display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;}',
      '.toast .toast-body{flex:1;}',
      '.toast .toast-title{font-weight:600;margin-bottom:2px;display:flex;align-items:center;gap:6px;}',
      '.toast .toast-msg{color:var(--muted,#666);font-weight:400;font-size:12.5px;}',
      '.toast.hide{animation:toast-out .25s ease-in both;}',
      '@keyframes toast-in{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}',
      '@keyframes toast-out{to{transform:translateX(120%);opacity:0}}',

      /* --- Tema Shepherd personalizado (consistente con design system) --- */
      '.shepherd-theme-custom{--shepherd-bg:#fff;--shepherd-text:#1a1a1a;--shepherd-border:1px solid #e6e6e6;}',
      '.shepherd-theme-custom.shepherd{font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;border-radius:10px;box-shadow:0 16px 48px rgba(0,0,0,.14);max-width:340px;}',
      '.shepherd-theme-custom .shepherd-header{background:transparent;padding:14px 16px 0;}',
      '.shepherd-theme-custom .shepherd-title{font:600 15px/1.2 system-ui;color:#1a1a1a;letter-spacing:-.01em;margin:0;display:flex;align-items:center;gap:8px;}',
      '.shepherd-theme-custom .shepherd-title i{color:var(--accent,#3b6cf2);font-size:18px;}',
      '.shepherd-theme-custom .shepherd-text{padding:6px 16px 14px;font-size:13.5px;line-height:1.55;color:#444;}',
      '.shepherd-theme-custom .shepherd-text p{margin:0 0 6px;}',
      '.shepherd-theme-custom .shepherd-text p:last-child{margin:0;}',
      '.shepherd-theme-custom .shepherd-footer{padding:8px 12px 12px;border-top:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;gap:8px;}',
      '.shepherd-theme-custom .shepherd-progress{font:500 11px/1 ui-monospace,monospace;color:#888;}',
      '.shepherd-theme-custom .shepherd-button{font:500 12.5px/1 system-ui;padding:7px 12px;border-radius:6px;border:1px solid #e6e6e6;background:#fff;color:#1a1a1a;cursor:pointer;transition:all .12s;display:inline-flex;align-items:center;gap:5px;}',
      '.shepherd-theme-custom .shepherd-button:hover{background:#f5f5f5;border-color:#ccc;}',
      '.shepherd-theme-custom .shepherd-button-primary{background:#3b6cf2;color:#fff;border-color:#3b6cf2;}',
      '.shepherd-theme-custom .shepherd-button-primary:hover{background:#2d57d6;border-color:#2d57d6;}',
      '.shepherd-theme-custom .shepherd-cancel-icon{color:#888;}',
      '.shepherd-theme-custom .shepherd-cancel-icon:hover{color:#1a1a1a;}',

      /* --- Highlight del elemento apuntado --- */
      '.shepherd-target-clickable{position:relative;z-index:8500;}',

      /* --- Padding inferior para que el FAB no tape contenido --- */
      'body.has-help-fab{padding-bottom:80px;}',

      /* --- Responsive: en móvil el FAB más pequeño y arriba del contenido --- */
      '@media (max-width:640px){.help-fab{width:46px;height:46px;font-size:20px;bottom:16px;right:16px;}.help-fab-label{display:none;}}'
    ].join('');
    document.head.appendChild(s);
  }

  /* ===================================================================
     2. CARGAR SHEPHERD.JS (CDN, una sola vez)
     =================================================================== */
  function loadShepherd() {
    return new Promise(function (resolve, reject) {
      if (window.Shepherd) return resolve();
      // CSS
      if (!document.querySelector('link[href*="shepherd"]')) {
        var css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = SHEPHERD_CSS;
        document.head.appendChild(css);
      }
      // JS
      var s = document.createElement('script');
      s.src = SHEPHERD_JS;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('No se pudo cargar Shepherd.js')); };
      document.head.appendChild(s);
    });
  }

  /* ===================================================================
     3. TOASTS — sistema de notificaciones
     =================================================================== */
  function ensureToastContainer() {
    var c = document.getElementById('toastContainer');
    if (c) return c;
    c = document.createElement('div');
    c.id = 'toastContainer';
    c.className = 'toast-container';
    document.body.appendChild(c);
    return c;
  }
  window.toast = function (opts) {
    opts = opts || {};
    var type = opts.type || 'info';
    var title = opts.title || '';
    var msg   = opts.message || opts.msg || '';
    var duration = opts.duration != null ? opts.duration : 3200;
    var iconMap = {
      success: '<i class="fa-solid fa-circle-check"></i>',
      warning: '<i class="fa-solid fa-triangle-exclamation"></i>',
      error:   '<i class="fa-solid fa-circle-xmark"></i>',
      info:    '<i class="fa-solid fa-circle-info"></i>'
    };
    var c = ensureToastContainer();
    var t = document.createElement('div');
    t.className = 'toast ' + type;
    var iconHtml = iconMap[type] || iconMap.info;
    t.innerHTML =
      '<span class="toast-icon">' + iconHtml + '</span>' +
      '<div class="toast-body">' +
        (title ? '<div class="toast-title"><span class="t-ic"></span><span class="t-tx"></span></div>' : '') +
        (msg   ? '<div class="toast-msg"></div>'   : '') +
      '</div>';
    if (title) {
      var tEl = t.querySelector('.toast-title');
      tEl.querySelector('.t-ic').innerHTML = iconHtml;
      tEl.querySelector('.t-tx').textContent = title;
    }
    if (msg) t.querySelector('.toast-msg').textContent = msg;
    c.appendChild(t);
    setTimeout(function () {
      t.classList.add('hide');
      setTimeout(function () { t.remove(); }, 260);
    }, duration);
  };

  /* ===================================================================
     4. DETECCIÓN DE PÁGINA
     =================================================================== */
  function getPageKey() {
    var path = window.location.pathname.replace(/\\/g, '/');
    var inScreens = /\/screens\//.test(path) || /^\/?screens\//.test(path);
    var file = path.split('/').pop() || 'index.html';
    file = file.split('?')[0].split('#')[0];
    if (!file || file === '/' ) file = 'index.html';
    if (file === 'sistema-docente-prototype.html') file = 'index.html';
    return { key: file.replace('.html', ''), inScreens: inScreens };
  }

  /* ===================================================================
     5. DEFINICIÓN DE TOURS — uno por página
     =================================================================== */
  function btn(text, action, primary) {
    return { text: text, action: action, classes: primary ? 'shepherd-button-primary' : '' };
  }

  var TOURS = {
    /* ---- LANDING (index.html) ---- */
    'index': [
      { id: 'welcome', title: '<i class="fa-solid fa-hand-wave"></i> Bienvenido al Sistema Docente',
        text: '<p>Esta es la página principal del sistema. Aquí encontrarás una visión general del proyecto Semilleros UTN 2026.</p><p>Haz clic en <strong>Siguiente</strong> para recorrer las secciones principales.</p>',
        buttons: [ btn('Saltar', function () { this.cancel(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'hero-actions', title: '<i class="fa-solid fa-rocket"></i> Acciones principales',
        text: '<p>Tres botones para empezar:</p><p><strong>Conocer el sistema</strong> te lleva a la descripción general. <strong>Explorar módulos</strong> muestra las 9 pantallas. <strong>Ingresar</strong> abre la pantalla de login.</p>',
        attachTo: { element: '.hero-actions', on: 'bottom' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'about', title: '<i class="fa-solid fa-bullseye"></i> Sobre el sistema',
        text: '<p>Esta sección explica el propósito del sistema: apoyar la planificación pedagógica cognitiva para educación inicial. Muestra 4 datos clave: roles, criterios de rúbrica, módulos y diseño responsive.</p>',
        attachTo: { element: '#about', on: 'top' },
        scrollTo: true,
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'flow', title: '<i class="fa-solid fa-rotate"></i> Flujo de uso',
        text: '<p>Los 10 pasos que sigue el docente: desde el inicio de sesión hasta la generación de informes. Cada paso se construye sobre el anterior.</p>',
        attachTo: { element: '#flow', on: 'top' },
        scrollTo: true,
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'modules', title: '<i class="fa-solid fa-puzzle-piece"></i> Los 9 módulos',
        text: '<p>Cada tarjeta es una pantalla funcional del sistema. Pasa el cursor sobre una tarjeta para ver un efecto 3D, y haz clic para abrir esa pantalla.</p>',
        attachTo: { element: '#modules', on: 'top' },
        scrollTo: true,
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'coverage', title: '<i class="fa-solid fa-circle-check"></i> Cobertura del proyecto',
        text: '<p>Aquí ves qué requisitos funcionales (RF-D01 a RF-D07) cubre este prototipo y cuáles quedan fuera del alcance.</p>',
        attachTo: { element: '#coverage', on: 'top' },
        scrollTo: true,
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Finalizar', function () { this.complete(); }, true) ] }
    ],

    /* ---- LOGIN ---- */
    'login': [
      { id: 'welcome', title: '<i class="fa-solid fa-lock"></i> Inicio de sesión',
        text: '<p>Esta es la puerta de entrada al sistema. Usa tus credenciales de docente para acceder.</p><p>Los datos ya están precargados para esta demo.</p>',
        buttons: [ btn('Saltar', function () { this.cancel(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'email', title: '<i class="fa-solid fa-envelope"></i> Correo electrónico',
        text: '<p>Escribe tu correo institucional. Solo personal autorizado puede acceder.</p>',
        attachTo: { element: '#email', on: 'bottom' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'pass', title: '<i class="fa-solid fa-key"></i> Contraseña',
        text: '<p>Tu contraseña es privada. En esta demo está precargada como <code>password</code>.</p>',
        attachTo: { element: '#pass', on: 'bottom' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'submit', title: '<i class="fa-solid fa-arrow-right"></i> Ingresar',
        text: '<p>Haz clic aquí para entrar al panel principal (Mis grupos). En la demo, te llevará directamente al dashboard.</p>',
        attachTo: { element: 'button[type="submit"]', on: 'top' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Finalizar', function () { this.complete(); }, true) ] }
    ],

    /* ---- DASHBOARD (Mis grupos) ---- */
    'dashboard': [
      { id: 'welcome', title: '<i class="fa-solid fa-clipboard-list"></i> Mis grupos',
        text: '<p>Aquí ves todos los grupos que tienes asignados. La docente actual es <strong>María García</strong>.</p>',
        buttons: [ btn('Saltar', function () { this.cancel(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'sidebar', title: '<i class="fa-solid fa-compass"></i> Menú lateral',
        text: '<p>Navega a cualquier sección desde aquí:</p><p><strong>Grupos</strong> (estás aquí), <strong>Unidades didácticas</strong>, <strong>Seguimiento grupal</strong> y <strong>Autoevaluación</strong>.</p>',
        attachTo: { element: '.sidebar', on: 'right' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'stats', title: '<i class="fa-solid fa-chart-column"></i> Resumen rápido',
        text: '<p>Estas dos tarjetas muestran de un vistazo cuántos grupos tienes y el total de alumnos. Se actualizan con un efecto de conteo animado.</p>',
        attachTo: { element: '.grid-2', on: 'bottom' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'table', title: '<i class="fa-solid fa-chalkboard-user"></i> Tabla de grupos',
        text: '<p>Cada fila es un grupo. Verás el nombre, número de alumnos, la unidad didáctica activa y cuántas evaluaciones se han hecho.</p><p>El botón <strong>Abrir</strong> te lleva al detalle del grupo.</p>',
        attachTo: { element: 'table', on: 'top' },
        scrollTo: true,
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'new', title: '<i class="fa-solid fa-circle-plus"></i> Nuevo grupo',
        text: '<p>Usa este botón para crear un grupo nuevo. Se abrirá un formulario donde defines el nombre y el nivel.</p>',
        attachTo: { element: '.topbar-actions', on: 'bottom' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Finalizar', function () { this.complete(); }, true) ] }
    ],

    /* ---- GROUP (Detalle del grupo) ---- */
    'group': [
      { id: 'welcome', title: '<i class="fa-solid fa-people-group"></i> Detalle del grupo',
        text: '<p>Esta pantalla muestra toda la información de un grupo específico: estadísticas y la lista de alumnos.</p>',
        buttons: [ btn('Saltar', function () { this.cancel(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'stats', title: '<i class="fa-solid fa-chart-column"></i> Estadísticas del grupo',
        text: '<p>Cuatro tarjetas con: total de alumnos, cuántos han sido evaluados, el porcentaje de progreso grupal y la unidad activa.</p>',
        attachTo: { element: '.grid-4', on: 'bottom' },
        scrollTo: true,
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'search', title: '<i class="fa-solid fa-magnifying-glass"></i> Buscar alumno',
        text: '<p>Escribe el nombre de un alumno para filtrar la tabla. La búsqueda es en tiempo real.</p>',
        attachTo: { element: 'input[type="search"]', on: 'bottom' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'students', title: '<i class="fa-solid fa-children"></i> Lista de alumnos',
        text: '<p>Cada fila muestra un alumno con su representante y contacto. Las insignias de colores indican el progreso de evaluaciones.</p>',
        attachTo: { element: 'table', on: 'top' },
        scrollTo: true,
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'actions', title: '<i class="fa-solid fa-bullseye"></i> Acciones por alumno',
        text: '<p>Para cada alumno tienes dos botones:</p><p><strong>Perfil</strong> abre la ficha completa. <strong>Evaluar</strong> lleva a la pantalla de evaluación con rúbrica.</p>',
        attachTo: { element: '.table-wrap', on: 'top' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'add', title: '<i class="fa-solid fa-circle-plus"></i> Añadir alumno',
        text: '<p>Para registrar un alumno nuevo. Te pedirá nombre, representante y teléfono de contacto.</p>',
        attachTo: { element: '.topbar-actions .btn', on: 'bottom' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Finalizar', function () { this.complete(); }, true) ] }
    ],

    /* ---- STUDENT (Perfil del alumno) ---- */
    'student': [
      { id: 'welcome', title: '<i class="fa-solid fa-user"></i> Perfil del alumno',
        text: '<p>Aquí ves toda la información individual de un alumno: progreso, historial y notas de apoyo.</p>',
        buttons: [ btn('Saltar', function () { this.cancel(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'tabs', title: '<i class="fa-solid fa-folder-tree"></i> Tres vistas',
        text: '<p><strong>Progreso</strong>: rúbrica actual y barras por unidad.<br><strong>Historial</strong>: línea de tiempo de evaluaciones previas.<br><strong>Notas</strong>: acciones de apoyo registradas.</p>',
        attachTo: { element: '.tabs', on: 'bottom' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'rubric', title: '<i class="fa-solid fa-clipboard-list"></i> Rúbrica cognitiva',
        text: '<p>Los 5 criterios de evaluación: Clasificación, Seriación, Construcción de conocimiento, Pensamiento lógico y Metacognición. Cada uno con su nivel actual.</p>',
        attachTo: { element: '.rubric-grid', on: 'top' },
        scrollTo: true,
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'progress', title: '<i class="fa-solid fa-chart-line"></i> Progreso por unidad',
        text: '<p>Barras que muestran qué porcentaje de criterios se han logrado en cada unidad didáctica.</p>',
        attachTo: { element: '.card .progress-bar', on: 'top' },
        scrollTo: true,
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'actions', title: '<i class="fa-solid fa-bullseye"></i> Acciones rápidas',
        text: '<p><strong>Evaluar</strong> abre la pantalla de rúbrica. <strong>Ficha de monitoreo</strong> registra observaciones y estrategias de mediación cognitiva.</p>',
        attachTo: { element: '.topbar-actions', on: 'bottom' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Finalizar', function () { this.complete(); }, true) ] }
    ],

    /* ---- EVALUATE (Evaluación con rúbrica) ---- */
    'evaluate': [
      { id: 'welcome', title: '<i class="fa-solid fa-circle-check"></i> Evaluación con rúbrica',
        text: '<p>Registra el desempeño del alumno usando los 5 criterios cognitivos. La unidad activa es <strong>Unidad 3</strong>.</p>',
        buttons: [ btn('Saltar', function () { this.cancel(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'student', title: '<i class="fa-solid fa-children"></i> Alumno a evaluar',
        text: '<p>La cabecera muestra a qué alumno estás evaluando. <strong>Cambiar alumno</strong> rota entre los alumnos del grupo.</p>',
        attachTo: { element: '.content .card', on: 'bottom' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'summary', title: '<i class="fa-solid fa-calculator"></i> Resumen en vivo',
        text: '<p>Estas tres tarjetas cuentan automáticamente cuántos criterios quedan en cada nivel (I, EP, L) a medida que marcas opciones.</p>',
        attachTo: { element: '#summaryBar', on: 'bottom' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'criteria', title: '<i class="fa-solid fa-ruler"></i> Los 5 criterios',
        text: '<p>Para cada criterio selecciona el nivel alcanzado:</p><p><strong>I</strong> = Iniciado · <strong>EP</strong> = En Proceso · <strong>L</strong> = Logrado</p><p>El color del borde cambia según tu selección.</p>',
        attachTo: { element: '.eval-grid', on: 'top' },
        scrollTo: true,
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'detalle', title: '<i class="fa-solid fa-book"></i> Ver rúbrica detallada',
        text: '<p>Cada criterio tiene un botón <strong>Ver rúbrica</strong> que muestra ejemplos concretos de cada nivel. Útil para decidir con seguridad.</p>',
        attachTo: { element: '.btn-detalle', on: 'left' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'save', title: '<i class="fa-solid fa-floppy-disk"></i> Guardar',
        text: '<p>Al guardar verás un mensaje de confirmación con la hora del registro. La evaluación queda asociada a la unidad activa.</p>',
        attachTo: { element: 'button[type="submit"]', on: 'top' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Finalizar', function () { this.complete(); }, true) ] }
    ],

    /* ---- MONITORING (Ficha de monitoreo) ---- */
    'monitoring': [
      { id: 'welcome', title: '<i class="fa-solid fa-note-sticky"></i> Ficha de monitoreo',
        text: '<p>Complemento de la evaluación. Aquí registras <strong>observaciones detalladas</strong> y <strong>acciones de apoyo</strong> (mediación cognitiva) para cada criterio.</p>',
        buttons: [ btn('Saltar', function () { this.cancel(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'header', title: '<i class="fa-solid fa-compass"></i> Navegación',
        text: '<p>← <strong>Evaluación</strong> regresa a la rúbrica. La cabecera muestra a qué alumno pertenece esta ficha.</p>',
        attachTo: { element: '.topbar', on: 'bottom' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'fields', title: '<i class="fa-solid fa-puzzle-piece"></i> Cinco áreas de monitoreo',
        text: '<p>Clasificación, Seriación, Asimilación/Acomodación, Justificación lógica y Autorregulación. Cada una tiene un nivel y dos áreas de texto.</p>',
        attachTo: { element: '.field-card', on: 'top' },
        scrollTo: true,
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'select', title: '<i class="fa-solid fa-sliders"></i> Nivel de logro',
        text: '<p>Selecciona el nivel alcanzado. Las opciones son: <strong>Logrado (L)</strong>, <strong>En Proceso (EP)</strong> e <strong>Iniciado (I)</strong>.</p>',
        attachTo: { element: '.field-card select', on: 'right' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'texts', title: '<i class="fa-solid fa-pen-fancy"></i> Observaciones y apoyo',
        text: '<p><strong>Observaciones</strong>: lo que el alumno hizo o no hizo. <strong>Acciones de apoyo</strong>: qué estrategia usarás para ayudarlo.</p>',
        attachTo: { element: '.actions-support', on: 'top' },
        scrollTo: true,
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'save', title: '<i class="fa-solid fa-floppy-disk"></i> Guardar ficha',
        text: '<p>Confirma el registro. Se mostrará un mensaje con el resumen de lo guardado.</p>',
        attachTo: { element: 'button[type="submit"]', on: 'top' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Finalizar', function () { this.complete(); }, true) ] }
    ],

    /* ---- UNITS (Unidades didácticas) ---- */
    'units': [
      { id: 'welcome', title: '<i class="fa-solid fa-book"></i> Unidades didácticas',
        text: '<p>Las unidades son la planificación de cada temática que trabajas con un grupo. Aquí ves, filtras y editas todas las unidades.</p>',
        buttons: [ btn('Saltar', function () { this.cancel(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'filters', title: '<i class="fa-solid fa-magnifying-glass"></i> Filtros y búsqueda',
        text: '<p>Usa los chips <strong>Todas / Activas / Archivadas</strong> para acotar la lista. La búsqueda es por nombre.</p>',
        attachTo: { element: '.card:first-of-type', on: 'bottom' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'cards', title: '📚 Tarjetas de unidades',
        text: '<p>Cada tarjeta muestra: nombre, grupos donde se aplica, duración, ámbito, destrezas y cantidad de evaluaciones. Las archivadas aparecen atenuadas.</p>',
        attachTo: { element: '.unit-card', on: 'top' },
        scrollTo: true,
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'actions', title: '✏️ Acciones de cada unidad',
        text: '<p><strong>Editar</strong> modifica la unidad. <strong>Clonar</strong> crea una copia para reutilizarla. <strong>Archivar</strong> la mueve fuera de la lista activa.</p>',
        attachTo: { element: '.unit-card .actions', on: 'left' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'new', title: '<i class="fa-solid fa-circle-plus"></i> Nueva unidad',
        text: '<p>Crea una unidad desde cero. El formulario te pide: nombre, ámbito, semanas, objetivos, destrezas, actividades, técnica didáctica y criterios.</p>',
        attachTo: { element: '.topbar-actions', on: 'bottom' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Finalizar', function () { this.complete(); }, true) ] }
    ],

    /* ---- GROUP-TRACKING (Seguimiento grupal) ---- */
    'group-tracking': [
      { id: 'welcome', title: '<i class="fa-solid fa-chart-column"></i> Seguimiento grupal',
        text: '<p>Vista consolidada del desempeño de un grupo. Compara criterios y detecta rápidamente los que necesitan refuerzo.</p>',
        buttons: [ btn('Saltar', function () { this.cancel(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'filters', title: '<i class="fa-solid fa-sliders"></i> Cambiar grupo y unidad',
        text: '<p>Los selectores arriba a la derecha te permiten cambiar el grupo y la unidad didáctica que se está analizando.</p>',
        attachTo: { element: '.topbar-actions', on: 'bottom' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'stats', title: '<i class="fa-solid fa-chart-line"></i> Estadísticas globales',
        text: '<p>Total de alumnos evaluados, porcentaje de logro promedio y cuántos criterios requieren refuerzo adicional.</p>',
        attachTo: { element: '.grid-3', on: 'bottom' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'chart', title: '<i class="fa-solid fa-chart-column"></i> Gráfico por criterio',
        text: '<p>Cada barra muestra cuántos alumnos están en I (rojo), EP (amarillo) y L (verde) para un criterio. La fila resaltada en rojo es la que requiere más refuerzo.</p>',
        attachTo: { element: '.bars', on: 'top' },
        scrollTo: true,
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'table', title: '<i class="fa-solid fa-children"></i> Resumen por alumno',
        text: '<p>Tabla con el nivel de cada alumno en los 5 criterios. Ideal para identificar casos individuales con dificultad.</p>',
        attachTo: { element: 'table', on: 'top' },
        scrollTo: true,
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Finalizar', function () { this.complete(); }, true) ] }
    ],

    /* ---- SELF-EVAL (Autoevaluación docente) ---- */
    'self-eval': [
      { id: 'welcome', title: '<i class="fa-solid fa-user-pen"></i> Autoevaluación docente',
        text: '<p>Reflexiona sobre tu práctica. Responde 6 preguntas Sí / En Proceso / No y agrega una reflexión a cada una.</p>',
        buttons: [ btn('Saltar', function () { this.cancel(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'context', title: '<i class="fa-solid fa-book"></i> Unidad asociada',
        text: '<p>La autoevaluación se vincula a la unidad activa (Unidad 3). Puedes completar una por unidad o por sesión.</p>',
        attachTo: { element: '.context-badge', on: 'bottom' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'summary', title: '<i class="fa-solid fa-calculator"></i> Resumen en vivo',
        text: '<p>Estas tres tarjetas cuentan automáticamente cuántas respuestas son Sí, En Proceso y No.</p>',
        attachTo: { element: '#resumenEval', on: 'bottom' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'questions', title: '<i class="fa-solid fa-circle-question"></i> Las 6 preguntas',
        text: '<p>Cada tarjeta es una pregunta sobre tu práctica: conflicto cognitivo, material concreto, lenguaje, descubrimiento, preguntas abiertas e interacción social.</p>',
        attachTo: { element: '.question-card', on: 'top' },
        scrollTo: true,
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'reflexion', title: '<i class="fa-solid fa-pen-fancy"></i> Reflexión personal',
        text: '<p>Después de cada pregunta, escribe brevemente qué funcionó y qué mejorarías la próxima vez.</p>',
        attachTo: { element: '.reflexion', on: 'left' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Siguiente', function () { this.next(); }, true) ] },
      { id: 'save', title: '<i class="fa-solid fa-floppy-disk"></i> Guardar autoevaluación',
        text: '<p>Registra la autoevaluación. Quedará asociada a la unidad activa con la fecha y hora.</p>',
        attachTo: { element: 'button[type="submit"]', on: 'top' },
        buttons: [ btn('Atrás', function () { this.back(); }), btn('Finalizar', function () { this.complete(); }, true) ] }
    ]
  };

  /* ===================================================================
     6. CREACIÓN DEL TOUR
     =================================================================== */
  function buildTour(pageKey) {
    var steps = TOURS[pageKey] || TOURS['index'];
    if (!window.Shepherd) return null;
    var tour = new Shepherd.Tour({
      defaultStepOptions: {
        classes: 'shepherd-theme-custom',
        scrollTo: { behavior: 'smooth', block: 'center' },
        cancelIcon: { enabled: true, label: 'Cerrar' }
      },
      useModalOverlay: true,
      exitOnEsc: true,
      keyboardNavigation: true
    });
    steps.forEach(function (s, idx) {
      var step = {
        id: s.id,
        title: s.title,
        text: s.text,
        buttons: (s.buttons || []).map(function (b) {
          return {
            text: b.text,
            action: b.action,
            classes: b.classes || ''
          };
        })
      };
      if (s.attachTo) step.attachTo = s.attachTo;
      if (s.scrollTo) step.scrollTo = { behavior: 'smooth', block: 'center' };
      // Inyectar contador de progreso en cada paso
      step.buttons.unshift({
        text: '<span class="shepherd-progress">' + (idx + 1) + ' / ' + steps.length + '</span>',
        action: function () {},
        classes: 'shepherd-button-progress',
        disabled: true
      });
      tour.addStep(step);
    });
    return tour;
  }

  /* ===================================================================
     7. MONTAJE DEL BOTÓN FLOTANTE
     =================================================================== */
  function mountFab() {
    if (document.getElementById('helpFab')) return;
    document.body.classList.add('has-help-fab');
    var btn = document.createElement('button');
    btn.id = 'helpFab';
    btn.className = 'help-fab pulse';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Iniciar tour guiado de ayuda');
    btn.title = 'Iniciar tour guiado  (H)';
    btn.innerHTML = '<i class="fa-solid fa-circle-question" style="font-size:24px"></i>';
    var lbl = document.createElement('span');
    lbl.className = 'help-fab-label';
    lbl.textContent = 'Ayuda guiada  ·  H';
    btn.addEventListener('click', function () { btn.classList.remove('pulse'); startTour(); });
    document.body.appendChild(btn);
    document.body.appendChild(lbl);
    // Quitar el pulse después de unos segundos para no distraer
    setTimeout(function () { btn.classList.remove('pulse'); }, 8000);
  }

  /* ===================================================================
     8. INICIAR TOUR
     =================================================================== */
  function startTour() {
    loadShepherd().then(function () {
      var info = getPageKey();
      var tour = buildTour(info.key);
      if (!tour) {
        toast({ type: 'error', title: 'Error', message: 'No se pudo cargar el tour de ayuda.' });
        return;
      }
      tour.on('complete', function () {
        toast({ type: 'success', title: 'Tour finalizado', message: 'Ya conoces lo esencial de esta pantalla. ¡Pulsa ? cuando quieras repasarlo.' });
      });
      tour.on('cancel', function () {
        toast({ type: 'info', title: 'Tour cancelado', message: 'Puedes reiniciarlo con el botón ? o la tecla H.' });
      });
      tour.start();
    }).catch(function (err) {
      toast({ type: 'error', title: 'Sin conexión', message: 'El tour guiado requiere conexión a internet para cargar la librería.' });
    });
  }

  /* ===================================================================
     9. ATAJOS DE TECLADO
     =================================================================== */
  function bindKeyboard() {
    document.addEventListener('keydown', function (e) {
      // H = ayuda (sin modificadores)
      if ((e.key === 'h' || e.key === 'H') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        var tag = (e.target && e.target.tagName) || '';
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        e.preventDefault();
        startTour();
      }
    });
  }

  /* ===================================================================
     10. MEJORA DE FORMULARIOS: alerts → toasts
     =================================================================== */
  function upgradeAlerts() {
    // Reemplazar window.alert en este contexto: capturamos los onclick y formularios
    // para que las acciones simuladas den feedback moderno.
    var origAlert = window.alert;
    var alerted = false;
    window.alert = function (msg) {
      if (alerted) return;
      alerted = true;
      toast({ type: 'info', title: 'Acción simulada', message: String(msg || '').replace(/^Acción simulada:?\s*/i, '') });
      setTimeout(function () { alerted = false; }, 200);
    };
    // Interceptar formularios para mostrar un toast en lugar de alert
    document.querySelectorAll('form[onsubmit]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        // No prevenir más handlers; dejamos que el onsubmit del HTML corra,
        // pero capturamos el alert subsecuente vía wrapper.
        var text = (f.getAttribute('data-toast') || 'Cambios guardados correctamente.');
        toast({ type: 'success', title: '¡Listo!', message: text });
      }, true);
    });
  }

  /* ===================================================================
     11. INIT
     =================================================================== */
  function init() {
    injectStyles();
    mountFab();
    bindKeyboard();
    upgradeAlerts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
