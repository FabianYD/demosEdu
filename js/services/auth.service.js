/* ===================================================================
   AUTH SERVICE — autenticación de usuarios
   =================================================================== */
import { usersRepo } from '../repositories/users.repo.js';
import { session }   from '../repositories/session.js';
import { V, runValidators } from '../core/validators.js';

export const authService = {
  /**
   * Valida credenciales contra el repositorio de usuarios.
   * @returns {{ok: boolean, user?: object, error?: string}}
   */
  login(email, password) {
    const errMail = runValidators(email, [V.required, V.email]);
    if (errMail) return { ok: false, error: errMail };
    const errPwd  = runValidators(password, [V.required, V.minLen(4)]);
    if (errPwd) return { ok: false, error: errPwd };

    const user = usersRepo.byEmail(email);
    if (!user) return { ok: false, error: 'No existe un usuario con ese correo' };
    if (user.password !== password) return { ok: false, error: 'Contraseña incorrecta' };

    session.login(user.id);
    return { ok: true, user };
  },

  logout() { session.logout(); },

  current() { return session.current; },

  isLoggedIn() { return session.isLoggedIn(); },

  require() { return session.require(); }
};
