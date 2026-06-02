import { evaluationsRepo } from '../repositories/evaluations.repo.js';
import { studentsRepo } from '../repositories/students.repo.js';
import { unitsRepo } from '../repositories/units.repo.js';
import { V, runValidators } from '../core/validators.js';

const CRITERIA = [
  { key: 'clasificacion', label: 'Clasificación' },
  { key: 'seriacion',     label: 'Seriación' },
  { key: 'construccion',  label: 'Construcción de conocimiento' },
  { key: 'pensamiento',   label: 'Pensamiento lógico' },
  { key: 'metacognicion', label: 'Metacognición' }
];

const LEVELS = { I: 'Iniciado', EP: 'En Proceso', L: 'Logrado' };

export const evaluationsService = {
  CRITERIA,
  LEVELS,

  list: () => evaluationsRepo.list(),
  byStudent: (id) => evaluationsRepo.byStudent(id),
  byGroup:   (id) => evaluationsRepo.byGroup(id),
  byUnit:    (id) => evaluationsRepo.byUnit(id),
  latest:    (id) => evaluationsRepo.latestByStudent(id),

  /** Guarda una evaluación completa. */
  save(data) {
    const errors = {};
    if (runValidators(data.studentId, [V.required])) errors.studentId = 'Alumno requerido';
    if (runValidators(data.unitId,    [V.required])) errors.unitId    = 'Unidad requerida';
    if (Object.keys(errors).length) return { ok: false, errors };

    const student = studentsRepo.get(data.studentId);
    const unit    = unitsRepo.get(data.unitId);
    if (!student) return { ok: false, error: 'Alumno no existe' };
    if (!unit)    return { ok: false, error: 'Unidad no existe' };

    const id = evaluationsRepo.save({
      studentId: data.studentId,
      groupId:   student.groupId,
      unitId:    data.unitId,
      date:      Date.now(),
      criteria:  data.criteria || {},
      observations: data.observations || ''
    });
    return { ok: true, id };
  },

  remove(id) {
    evaluationsRepo.remove(id);
    return { ok: true };
  },

  /** Convierte nivel "I"/"EP"/"L" a clase CSS. */
  badgeClass(level) {
    return level === 'L' ? 'badge-achieved' : level === 'EP' ? 'badge-progress' : 'badge-initiated';
  }
};
