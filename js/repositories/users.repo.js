import { BaseRepository } from './base.repo.js';

class UsersRepository extends BaseRepository {
  constructor() { super('users'); }

  byEmail(email) {
    return this.find(u => u.email.toLowerCase() === String(email).toLowerCase());
  }
}

export const usersRepo = new UsersRepository();
