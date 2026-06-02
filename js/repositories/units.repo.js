import { BaseRepository } from './base.repo.js';

class UnitsRepository extends BaseRepository {
  constructor() { super('units'); }

  active()    { return this.filter(u => u.status !== 'archived'); }
  archived()  { return this.filter(u => u.status === 'archived'); }
  byGroup(groupId) {
    return this.filter(u => (u.groupIds || []).includes(groupId));
  }
}

export const unitsRepo = new UnitsRepository();
