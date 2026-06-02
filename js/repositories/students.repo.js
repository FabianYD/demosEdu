import { BaseRepository } from './base.repo.js';

class StudentsRepository extends BaseRepository {
  constructor() { super('students'); }

  byGroup(groupId) { return this.filter(s => s.groupId === groupId); }
  byId(id)         { return this.get(id); }
  findByName(groupId, name) {
    return this.byGroup(groupId).find(s => s.name.toLowerCase() === name.toLowerCase());
  }
}

export const studentsRepo = new StudentsRepository();
