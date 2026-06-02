/* ===================================================================
   EVENT BUS — pub/sub para comunicación desacoplada entre módulos
   ===================================================================
   • on(event, handler)      — suscribe un handler
   • off(event, handler)     — desuscribe
   • emit(event, payload)    — publica (sincrónico)
   • once(event, handler)    — suscribe una sola vez
   =================================================================== */
class EventBus {
  constructor() { this._handlers = new Map(); }

  on(event, handler) {
    if (!this._handlers.has(event)) this._handlers.set(event, new Set());
    this._handlers.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    const set = this._handlers.get(event);
    if (set) set.delete(handler);
  }

  emit(event, payload) {
    const set = this._handlers.get(event);
    if (!set) return;
    set.forEach(h => {
      try { h(payload); } catch (e) { console.error('[EventBus]', event, e); }
    });
  }

  once(event, handler) {
    const off = this.on(event, (p) => { off(); handler(p); });
  }
}

export const bus = new EventBus();

/* Eventos del dominio (catálogo) */
export const EVENTS = {
  GROUPS_CHANGED:    'groups:changed',
  STUDENTS_CHANGED:  'students:changed',
  UNITS_CHANGED:     'units:changed',
  TASKS_CHANGED:     'tasks:changed',
  EVALS_CHANGED:     'evaluations:changed',
  MONITORING_CHANGED:'monitoring:changed',
  SELFEVAL_CHANGED:  'selfeval:changed',
  NOTES_CHANGED:     'notes:changed',
  AUTH_CHANGED:      'auth:changed',
  TOAST:             'ui:toast'
};
