import { BaseRepository } from './base.repo.js';

class SelfEvalRepository extends BaseRepository {
  constructor() { super('selfevals'); }

  byGroup(groupId) { return this.filter(s => s.groupId === groupId); }
  byUnit(unitId)   { return this.filter(s => s.unitId === unitId); }
  latestFor(groupId, unitId) {
    return this.byGroup(groupId)
      .filter(s => s.unitId === unitId)
      .sort((a, b) => b.date - a.date)[0] || null;
  }
}

export const selfEvalRepo = new SelfEvalRepository();
