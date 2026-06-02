/* ===================================================================
   SESSION — usuario autenticado actualmente
   =================================================================== */
import { storage } from '../core/storage.js';
import { bus, EVENTS } from '../core/event-bus.js';

const KEY = 'auth:currentUserId';

export const session = {
  get current() {
    const id = storage.get(KEY);
    if (!id) return null;
    return storage.get(`users:item:${id}`) || null;
  },
  isLoggedIn() { return !!this.current; },
  login(userId) {
    storage.set(KEY, userId);
    bus.emit(EVENTS.AUTH_CHANGED, { userId });
  },
  logout() {
    storage.remove(KEY);
    bus.emit(EVENTS.AUTH_CHANGED, { userId: null });
  },
  require() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return null;
    }
    return this.current;
  }
};
