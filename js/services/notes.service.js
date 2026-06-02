import { notesRepo } from '../repositories/notes.repo.js';
import { studentsRepo } from '../repositories/students.repo.js';
import { V, runValidators } from '../core/validators.js';

export const notesService = {
  byStudent: (id) => notesRepo.byStudent(id),

  add(data) {
    const err = runValidators(data.text, [V.required, V.minLen(3)]);
    if (err) return { ok: false, error: err };
    if (!studentsRepo.get(data.studentId)) return { ok: false, error: 'Alumno no existe' };

    const id = notesRepo.save({
      studentId: data.studentId,
      type:      data.type || 'observation',
      text:      data.text.trim(),
      date:      Date.now()
    });
    return { ok: true, id };
  },

  remove(id) {
    notesRepo.remove(id);
    return { ok: true };
  }
};
