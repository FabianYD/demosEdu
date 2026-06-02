import { studentsRepo } from '../repositories/students.repo.js';
import { groupsRepo } from '../repositories/groups.repo.js';
import { evaluationsRepo } from '../repositories/evaluations.repo.js';
import { monitoringRepo } from '../repositories/monitoring.repo.js';
import { notesRepo } from '../repositories/notes.repo.js';
import { V, runValidators } from '../core/validators.js';
import { slugify } from '../core/id.js';

export const studentsService = {
  list: () => studentsRepo.list(),
  get:  (id) => studentsRepo.get(id),
  byGroup: (groupId) => studentsRepo.byGroup(groupId),

  create(data) {
    const errors = {};
    if (runValidators(data.name, [V.required, V.minLen(2)])) errors.name = 'Nombre inválido';
    if (runValidators(data.groupId, [V.required])) errors.groupId = 'Selecciona un grupo';
    if (Object.keys(errors).length) return { ok: false, errors };

    const group = groupsRepo.get(data.groupId);
    if (!group) return { ok: false, error: 'Grupo no encontrado' };

    const id = slugify(data.name) + '-' + Date.now().toString(36);
    const newId2 = studentsRepo.save({
      id,
      groupId: data.groupId,
      name: data.name.trim(),
      representative: (data.representative || '').trim(),
      phone: (data.phone || '').trim(),
      createdAt: Date.now()
    });
    return { ok: true, id: newId2 };
  },

  update(id, patch) {
    const current = studentsRepo.get(id);
    if (!current) return { ok: false, error: 'Alumno no encontrado' };
    studentsRepo.save({ ...current, ...patch, id });
    return { ok: true };
  },

  /** Elimina un alumno y todos sus datos asociados. */
  remove(id) {
    evaluationsRepo.byStudent(id).forEach(e => evaluationsRepo.remove(e.id));
    monitoringRepo.byStudent(id).forEach(m => monitoringRepo.remove(m.id));
    notesRepo.byStudent(id).forEach(n => notesRepo.remove(n.id));
    studentsRepo.remove(id);
    return { ok: true };
  },

  /** Cuenta de evaluaciones del alumno. */
  evalCount(id) {
    return evaluationsRepo.byStudent(id).length;
  },

  /** Última evaluación del alumno. */
  latestEval(id) {
    return evaluationsRepo.latestByStudent(id);
  },

  /** Última ficha de monitoreo. */
  latestMonitoring(id) {
    return monitoringRepo.latestByStudent(id);
  },

  /** Notas del alumno. */
  notes(id) {
    return notesRepo.byStudent(id);
  }
};
