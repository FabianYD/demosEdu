/* ===================================================================
   BASE REPOSITORY — CRUD genérico sobre storage
   ===================================================================
   Patrón Repository: encapsula el acceso a datos (localStorage).
   Las pantallas NUNCA tocan storage directamente — siempre pasan
   por el repositorio. Esto permite cambiar la fuente de datos
   (IndexedDB, fetch a un backend, etc.) sin tocar las vistas.
   =================================================================== */
import { storage } from '../core/storage.js';
import { newId } from '../core/id.js';
import { bus } from '../core/event-bus.js';

export class BaseRepository {
  /**
   * @param {string} entity  nombre de la entidad (e.g. "groups")
   */
  constructor(entity) {
    this.entity = entity;
  }

  _key(id)         { return `${this.entity}:item:${id}`; }
  _indexKey()      { return `${this.entity}:index`; }
  _readIndex()     { return storage.get(this._indexKey(), []); }
  _writeIndex(idx) { storage.set(this._indexKey(), idx); }

  list() {
    return this._readIndex()
      .map(id => this.get(id))
      .filter(Boolean);
  }

  get(id) {
    return storage.get(this._key(id));
  }

  find(predicate) {
    return this.list().find(predicate);
  }

  filter(predicate) {
    return this.list().filter(predicate);
  }

  /**
   * Crea o actualiza un registro.
   * Si no trae id, lo genera. Devuelve el id.
   * Emite el evento del dominio correspondiente.
   */
  save(item) {
    if (!item || typeof item !== 'object') throw new Error('save: item inválido');
    if (!item.id) item = { ...item, id: newId(this.entity.slice(0, 3)) };
    item.updatedAt = Date.now();
    storage.set(this._key(item.id), item);
    const idx = this._readIndex();
    if (!idx.includes(item.id)) { idx.push(item.id); this._writeIndex(idx); }
    this._emitChanged();
    return item.id;
  }

  remove(id) {
    if (!id) return false;
    storage.remove(this._key(id));
    this._writeIndex(this._readIndex().filter(x => x !== id));
    this._emitChanged();
    return true;
  }

  removeMany(ids) { ids.forEach(id => this.remove(id)); }

  count() { return this._readIndex().length; }

  clear() {
    this.list().forEach(item => storage.remove(this._key(item.id)));
    storage.remove(this._indexKey());
    this._emitChanged();
  }

  _emitChanged() {
    bus.emit(this._changedEvent, { entity: this.entity });
  }

  get _changedEvent() {
    return `${this.entity.replace(/s$/, '')}:changed`;
  }
}
