import { BaseRepository } from './base.repo.js';

class MonitoringRepository extends BaseRepository {
  constructor() { super('monitoring'); }

  byStudent(studentId) { return this.filter(m => m.studentId === studentId); }
  byGroup(groupId)     { return this.filter(m => m.groupId === groupId); }
  latestByStudent(studentId) {
    return this.byStudent(studentId).sort((a, b) => b.date - a.date)[0] || null;
  }
}

export const monitoringRepo = new MonitoringRepository();
