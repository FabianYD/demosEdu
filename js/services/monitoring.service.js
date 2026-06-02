import { monitoringRepo } from '../repositories/monitoring.repo.js';
import { studentsRepo } from '../repositories/students.repo.js';
import { unitsRepo } from '../repositories/units.repo.js';
import { V, runValidators } from '../core/validators.js';

const FIELDS = [
  { key: 'clasificacion',   label: 'Clasificación',   q: '¿Agrupa objetos de cuidado personal vs. limpieza del hogar?' },
  { key: 'seriacion',       label: 'Seriación',       q: '¿Ordena los pasos para el lavado de manos o cruce de calle?' },
  { key: 'asimilacion',     label: 'Asimilación / Acomodación', q: '¿Aplica lo aprendido sobre riesgos a una nueva situación?' },
  { key: 'justificacion',   label: 'Justificación lógica',      q: '¿Explica por qué una acción es segura o peligrosa?' },
  { key: 'autorregulacion', label: 'Autorregulación',           q: '¿Identifica cuándo necesita ayuda o cometió un error?' }
];

export const monitoringService = {
  FIELDS,

  list: () => monitoringRepo.list(),
  byStudent: (id) => monitoringRepo.byStudent(id),
  byGroup:   (id) => monitoringRepo.byGroup(id),
  latest:    (id) => monitoringRepo.latestByStudent(id),

  save(data) {
    const errors = {};
    if (runValidators(data.studentId, [V.required])) errors.studentId = 'Alumno requerido';
    if (runValidators(data.unitId,    [V.required])) errors.unitId    = 'Unidad requerida';
    if (Object.keys(errors).length) return { ok: false, errors };

    const student = studentsRepo.get(data.studentId);
    const unit    = unitsRepo.get(data.unitId);
    if (!student) return { ok: false, error: 'Alumno no existe' };
    if (!unit)    return { ok: false, error: 'Unidad no existe' };

    const id = monitoringRepo.save({
      studentId: data.studentId,
      groupId:   student.groupId,
      unitId:    data.unitId,
      date:      Date.now(),
      fields:    data.fields || {}
    });
    return { ok: true, id };
  },

  remove(id) {
    monitoringRepo.remove(id);
    return { ok: true };
  },

  badgeClass(level) {
    return level === 'L' ? 'badge-achieved' : level === 'EP' ? 'badge-progress' : 'badge-initiated';
  }
};
