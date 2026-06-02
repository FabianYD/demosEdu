import { BaseRepository } from './base.repo.js';

class EvaluationsRepository extends BaseRepository {
  constructor() { super('evaluations'); }

  byStudent(studentId) { return this.filter(e => e.studentId === studentId); }
  byGroup(groupId)     { return this.filter(e => e.groupId === groupId); }
  byUnit(unitId)       { return this.filter(e => e.unitId === unitId); }
  byTask(taskId)       { return this.filter(e => e.taskId === taskId); }
  latestByStudent(studentId) {
    return this.byStudent(studentId).sort((a, b) => b.date - a.date)[0] || null;
  }
}

export const evaluationsRepo = new EvaluationsRepository();
