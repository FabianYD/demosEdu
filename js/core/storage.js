/* ===================================================================
   STORAGE — wrapper tipado sobre localStorage
   ===================================================================
   • get(key, fallback)        — JSON.parse con fallback
   • set(key, value)           — JSON.stringify
   • remove(key)
   • keys() / clear() / size()
   • Cada entidad se guarda bajo "sedu:<entidad>:<id>" o "sedu:<entidad>:index"
   =================================================================== */
const NS = 'sedu';

const fullKey = (k) => `${NS}:${k}`;

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(fullKey(key));
      if (raw == null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[storage.get]', key, e);
      return fallback;
    }
  },
  set(key, value) {
    try { localStorage.setItem(fullKey(key), JSON.stringify(value)); }
    catch (e) { console.error('[storage.set]', key, e); }
  },
  remove(key) { localStorage.removeItem(fullKey(key)); },
  has(key) { return localStorage.getItem(fullKey(key)) != null; },
  keys(prefix = '') {
    const out = [];
    const re = new RegExp(`^${NS}:${prefix ? prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : ''}`);
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (re.test(k)) out.push(k.slice(NS.length + 1));
    }
    return out;
  },
  clear() {
    const toDel = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(`${NS}:`)) toDel.push(k);
    }
    toDel.forEach(k => localStorage.removeItem(k));
  }
};
