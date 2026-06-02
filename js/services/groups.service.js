import { groupsRepo } from '../repositories/groups.repo.js';
import { studentsRepo } from '../repositories/students.repo.js';
import { evaluationsRepo } from '../repositories/evaluations.repo.js';
import { monitoringRepo } from '../repositories/monitoring.repo.js';
import { selfEvalRepo } from '../repositories/self-eval.repo.js';
import { notesRepo } from '../repositories/notes.repo.js';
import { V, runValidators } from '../core/validators.js';
import { slugify } from '../core/id.js';

export const groupsService = {
  list: () => groupsRepo.list(),
  get:  (id) => groupsRepo.get(id),
  active: () => groupsRepo.active(),

  create(data) {
    const err = runValidators(data.name, [V.required, V.minLen(2)]);
    if (err) return { ok: false, error: err };
    const id = slugify(data.name) + '-' + Date.now().toString(36);
    const newId2 = groupsRepo.save({
      id, ...data,
      status: 'active',
      unitIds: data.unitIds || [],
      createdAt: Date.now()
    });
    return { ok: true, id: newId2 };
  },

  update(id, patch) {
    const current = groupsRepo.get(id);
    if (!current) return { ok: false, error: 'Grupo no encontrado' };
    groupsRepo.save({ ...current, ...patch, id });
    return { ok: true };
  },

  /** Elimina un grupo y todos sus datos asociados (cascada). */
  remove(id) {
    const studentIds = studentsRepo.byGroup(id).map(s => s.id);
    // Notas de esos alumnos
    studentIds.forEach(sid => notesRepo.byStudent(sid).forEach(n => notesRepo.remove(n.id)));
    // Alumnos
    studentsRepo.removeMany(studentIds);
    // Evaluaciones, monitoreo, autoevaluaciones
    evaluationsRepo.byGroup(id).forEach(e => evaluationsRepo.remove(e.id));
    monitoringRepo.byGroup(id).forEach(m => monitoringRepo.remove(m.id));
    selfEvalRepo.byGroup(id).forEach(s => selfEvalRepo.remove(s.id));
    // Grupo
    groupsRepo.remove(id);
    return { ok: true };
  },

  /** Estadísticas agregadas de un grupo. */
  stats(id) {
    const students = studentsRepo.byGroup(id);
    const evals    = evaluationsRepo.byGroup(id);
    const evaluated = new Set(evals.map(e => e.studentId)).size;
    const total = students.length;
    const pct   = total ? Math.round((evaluated / total) * 100) : 0;
    return { totalStudents: total, evaluated, progressPct: pct };
  }
};
