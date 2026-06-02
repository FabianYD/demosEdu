import { BaseRepository } from './base.repo.js';

class GroupsRepository extends BaseRepository {
  constructor() { super('groups'); }

  byLevel(level) { return this.filter(g => g.level === level); }
  active()       { return this.filter(g => g.status !== 'archived'); }
  byUnit(unitId) { return this.filter(g => (g.unitIds || []).includes(unitId)); }
}

export const groupsRepo = new GroupsRepository();
