import { unitsRepo } from '../repositories/units.repo.js';
import { groupsRepo } from '../repositories/groups.repo.js';
import { V, runValidators } from '../core/validators.js';
import { slugify } from '../core/id.js';

export const unitsService = {
  list: () => unitsRepo.list(),
  get:  (id) => unitsRepo.get(id),
  active: () => unitsRepo.active(),
  archived: () => unitsRepo.archived(),
  byGroup: (groupId) => unitsRepo.byGroup(groupId),

  create(data) {
    const err = runValidators(data.name, [V.required, V.minLen(3)]);
    if (err) return { ok: false, error: err };
    const id = slugify(data.name) + '-' + Date.now().toString(36);
    const newId2 = unitsRepo.save({
      id,
      name: data.name.trim(),
      scope: data.scope || 'Convivencia',
      weeks: Number(data.weeks) || 4,
      groupIds: data.groupIds || [],
      objectives: data.objectives || '',
      skills: data.skills || '',
      activities: data.activities || '',
      technique: data.technique || 'Aprendizaje Basado en Problemas (ABP)',
      criteria: data.criteria || '',
      status: 'active',
      createdAt: Date.now()
    });
    return { ok: true, id: newId2 };
  },

  update(id, patch) {
    const current = unitsRepo.get(id);
    if (!current) return { ok: false, error: 'Unidad no encontrada' };
    unitsRepo.save({ ...current, ...patch, id });
    return { ok: true };
  },

  /** Clona una unidad como base para una nueva. */
  clone(id) {
    const src = unitsRepo.get(id);
    if (!src) return { ok: false, error: 'Unidad origen no encontrada' };
    const copy = { ...src, id: undefined, name: src.name + ' (copia)', status: 'active' };
    return this.create(copy);
  },

  archive(id) {
    return this.update(id, { status: 'archived' });
  },

  unarchive(id) {
    return this.update(id, { status: 'active' });
  },

  remove(id) {
    unitsRepo.remove(id);
    return { ok: true };
  },

  /** Sugiere unidades para un grupo según sus unitIds. */
  suggestForGroup(groupId) {
    const group = groupsRepo.get(groupId);
    if (!group) return [];
    return this.byGroup(groupId);
  }
};
