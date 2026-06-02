import { BaseRepository } from './base.repo.js';

class EvaluationsRepository extends BaseRepository {
  constructor() { super('evaluations'); }

  byStudent(studentId) { return this.filter(e => e.studentId === studentId); }
  byGroup(groupId)     { return this.filter(e => e.groupId === groupId); }
  byUnit(unitId)       { return this.filter(e => e.unitId === unitId); }
  latestByStudent(studentId) {
    return this.byStudent(studentId).sort((a, b) => b.date - a.date)[0] || null;
  }
}

export const evaluationsRepo = new EvaluationsRepository();
