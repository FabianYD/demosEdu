/* ===================================================================
   APP — punto de entrada que publica la API en window.App
   ===================================================================
   Después de cargar <script type="module" src="js/app.js"></script>,
   cualquier script (incluido el de las páginas) puede usar:

     App.auth.login(email, pass)
     App.groups.list()
     App.students.create({...})
     App.toast.success('Hecho')
     App.modal.open({...})
     ...
   =================================================================== */
import { authService }      from './services/auth.service.js';
import { groupsService }    from './services/groups.service.js';
import { studentsService }  from './services/students.service.js';
import { unitsService }     from './services/units.service.js';
import { evaluationsService } from './services/evaluations.service.js';
import { monitoringService }  from './services/monitoring.service.js';
import { selfEvalService }    from './services/self-eval.service.js';
import { notesService }       from './services/notes.service.js';

import { groupsRepo }       from './repositories/groups.repo.js';
import { studentsRepo }     from './repositories/students.repo.js';
import { unitsRepo }        from './repositories/units.repo.js';
import { evaluationsRepo }  from './repositories/evaluations.repo.js';
import { monitoringRepo }   from './repositories/monitoring.repo.js';
import { selfEvalRepo }     from './repositories/self-eval.repo.js';
import { notesRepo }        from './repositories/notes.repo.js';
import { usersRepo }        from './repositories/users.repo.js';
import { session }          from './repositories/session.js';

import { storage }          from './core/storage.js';
import { bus, EVENTS }      from './core/event-bus.js';
import { Icon }             from './views/icons.js';
import { Modal }            from './views/modal.js';
import { toast }            from './views/toast.js';
import { seedIfEmpty, resetAll } from './seed.js';

function ready(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  } else { fn(); }
}

ready(() => {
  // Cargar datos de demo si es la primera vez
  seedIfEmpty();

  // Exponer API global
  window.App = {
    auth: authService,
    groups: groupsService,
    students: studentsService,
    units: unitsService,
    evaluations: evaluationsService,
    monitoring: monitoringService,
    selfEval: selfEvalService,
    notes: notesService,

    repos: { groupsRepo, studentsRepo, unitsRepo, evaluationsRepo, monitoringRepo, selfEvalRepo, notesRepo, usersRepo },
    session,
    storage,
    bus, EVENTS,
    Icon, Modal, toast,
    resetAll
  };

  console.info('%cSistema Docente listo', 'color:#3b6cf2;font-weight:600', '· usa window.App para inspeccionar la API');
});
