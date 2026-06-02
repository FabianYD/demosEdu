import { BaseRepository } from './base.repo.js';

class NotesRepository extends BaseRepository {
  constructor() { super('notes'); }

  byStudent(studentId) {
    return this.filter(n => n.studentId === studentId)
      .sort((a, b) => b.date - a.date);
  }
}

export const notesRepo = new NotesRepository();
