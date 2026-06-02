import { selfEvalRepo } from '../repositories/self-eval.repo.js';
import { groupsRepo } from '../repositories/groups.repo.js';
import { unitsRepo } from '../repositories/units.repo.js';
import { V, runValidators } from '../core/validators.js';

const QUESTIONS = [
  { key: 'q1', text: '¿Provocaron las actividades un conflicto cognitivo que desafiara sus esquemas previos?' },
  { key: 'q2', text: '¿Se priorizó el uso de material concreto antes de pasar a representaciones abstractas?' },
  { key: 'q3', text: '¿El lenguaje utilizado fue adecuado para el nivel de egocentrismo del niño?' },
  { key: 'q4', text: '¿Se permitió que el niño descubriera la solución por sí mismo (aprendizaje por descubrimiento)?' },
  { key: 'q5', text: '¿Las preguntas realizadas fueron abiertas (ej. "¿Qué pasaría si...?") en lugar de cerradas?' },
  { key: 'q6', text: '¿El ambiente de aula promovió la interacción social como motor de desarrollo?' }
];

export const selfEvalService = {
  QUESTIONS,

  list: () => selfEvalRepo.list(),
  byGroup: (id) => selfEvalRepo.byGroup(id),
  latestFor: (groupId, unitId) => selfEvalRepo.latestFor(groupId, unitId),

  save(data) {
    const errors = {};
    if (runValidators(data.groupId, [V.required])) errors.groupId = 'Grupo requerido';
    if (runValidators(data.unitId,  [V.required])) errors.unitId  = 'Unidad requerida';
    if (Object.keys(errors).length) return { ok: false, errors };

    const group = groupsRepo.get(data.groupId);
    const unit  = unitsRepo.get(data.unitId);
    if (!group) return { ok: false, error: 'Grupo no existe' };
    if (!unit)  return { ok: false, error: 'Unidad no existe' };

    const id = selfEvalRepo.save({
      groupId: data.groupId,
      unitId:  data.unitId,
      teacherId: data.teacherId || null,
      date:    Date.now(),
      answers:    data.answers || {},
      reflections:data.reflections || {}
    });
    return { ok: true, id };
  },

  remove(id) {
    selfEvalRepo.remove(id);
    return { ok: true };
  }
};
