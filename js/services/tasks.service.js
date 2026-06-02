import { tasksRepo } from '../repositories/tasks.repo.js';
import { unitsRepo } from '../repositories/units.repo.js';
import { V, runValidators } from '../core/validators.js';
import { slugify } from '../core/id.js';

export const tasksService = {
  list: () => tasksRepo.list(),
  get:  (id) => tasksRepo.get(id),
  byUnit: (unitId) => tasksRepo.byUnit(unitId),

  create(data) {
    const err = runValidators(data.title, [V.required, V.minLen(3)]);
    if (err) return { ok: false, error: err };
    if (!data.unitId || !unitsRepo.get(data.unitId)) return { ok: false, error: 'Unidad inválida' };

    const id = slugify(data.title) + '-' + Date.now().toString(36);
    const newId = tasksRepo.save({
      id,
      unitId: data.unitId,
      title: data.title.trim(),
      description: data.description || '',
      imageUrl: data.imageUrl || '',
      createdAt: Date.now()
    });
    return { ok: true, id: newId };
  },

  update(id, patch) {
    const current = tasksRepo.get(id);
    if (!current) return { ok: false, error: 'Tarea no encontrada' };
    tasksRepo.save({ ...current, ...patch, id });
    return { ok: true };
  },

  remove(id) {
    tasksRepo.remove(id);
    return { ok: true };
  }
};
