import { BaseRepository } from './base.repo.js';

class TasksRepository extends BaseRepository {
  constructor() { super('tasks'); }

  byUnit(unitId) {
    return this.filter(t => t.unitId === unitId);
  }
}

export const tasksRepo = new TasksRepository();
