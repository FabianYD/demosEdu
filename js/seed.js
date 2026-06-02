/* ===================================================================
   SEED — carga datos de demostración la primera vez
   =================================================================== */
import { usersRepo }     from './repositories/users.repo.js';
import { groupsRepo }    from './repositories/groups.repo.js';
import { studentsRepo }  from './repositories/students.repo.js';
import { unitsRepo }     from './repositories/units.repo.js';
import { evaluationsRepo } from './repositories/evaluations.repo.js';
import { monitoringRepo }  from './repositories/monitoring.repo.js';
import { storage }       from './core/storage.js';

const SEED_FLAG = 'sedu:seeded:v2';

export function seedIfEmpty() {
  if (storage.get(SEED_FLAG)) return false;
  seed();
  storage.set(SEED_FLAG, Date.now());
  return true;
}

export function resetAll() {
  storage.clear();
  seed();
  storage.set(SEED_FLAG, Date.now());
}

function seed() {
  // 1. Usuario docente
  const mariaId = 'usr-maria-garcia';
  usersRepo.save({
    id: mariaId,
    email: 'maria.garcia@institucion.edu.ec',
    name: 'María García',
    role: 'Docente',
    password: 'password'
  });

  // 2. Grupos
  const groups = [
    { id: 'gpo-inicial-a', name: 'Inicial A', level: 'Inicial',           status: 'active', unitIds: ['uni-1','uni-3'] },
    { id: 'gpo-inicial-b', name: 'Inicial B', level: 'Inicial',           status: 'active', unitIds: ['uni-1','uni-2'] },
    { id: 'gpo-cuarto-a',  name: 'Cuarto A',  level: 'Básica elemental',  status: 'active', unitIds: ['uni-4'] },
    { id: 'gpo-cuarto-b',  name: 'Cuarto B',  level: 'Básica elemental',  status: 'active', unitIds: ['uni-1'] }
  ];
  groups.forEach(g => groupsRepo.save(g));

  // 3. Alumnos
  const students = [
    { groupId: 'gpo-inicial-a', name: 'Ana López',        representative: 'Carmen López', phone: '0995123456' },
    { groupId: 'gpo-inicial-a', name: 'Benjamín Ortiz',   representative: 'Luis Ortiz',    phone: '0987987654' },
    { groupId: 'gpo-inicial-a', name: 'Camila Rivas',     representative: 'Sofía Rivas',   phone: '0996123789' },
    { groupId: 'gpo-inicial-a', name: 'David Quispe',     representative: 'Rosa Quispe',   phone: '0994765123' },
    { groupId: 'gpo-inicial-a', name: 'Emma Tapia',       representative: 'Pedro Tapia',   phone: '0998345612' },
    { groupId: 'gpo-inicial-a', name: 'Gabriel Mendoza',  representative: 'Ana Mendoza',   phone: '0999123450' },
    { groupId: 'gpo-inicial-b', name: 'Sofía Pérez',      representative: 'Juan Pérez',    phone: '0998123456' },
    { groupId: 'gpo-inicial-b', name: 'Mateo Vega',       representative: 'Laura Vega',    phone: '0999988776' },
    { groupId: 'gpo-inicial-b', name: 'Valentina Cevallos', representative: 'Carlos Cevallos', phone: '0996554433' },
    { groupId: 'gpo-cuarto-a', name: 'Luis Morales',     representative: 'Marta Morales', phone: '0991112222' }
  ];
  students.forEach((s, i) => studentsRepo.save({ id: 'std-' + (i+1), ...s }));

  // 4. Unidades didácticas
  const units = [
    { id: 'uni-1', name: 'Unidad 1 — Reconociendo personas de confianza',  scope: 'Convivencia',         weeks: 3, groupIds: ['gpo-inicial-a','gpo-inicial-b','gpo-cuarto-b'],
      objectives: 'Identificar personas de confianza y陌生人', skills: 'Identificar miembros de su familia · Practicar normas de seguridad', activities: 'Láminas, role-playing, dibujo familiar.', technique: 'Modelamiento', criteria: 'Clasificación, seriación, construcción de conocimiento, pensamiento lógico, metacognición', status: 'active' },
    { id: 'uni-2', name: 'Unidad 2 — Personas seguras en mi entorno',     scope: 'Socio-afectivo',     weeks: 4, groupIds: ['gpo-inicial-b'],
      objectives: 'Reconocer personas seguras en distintos contextos', skills: '5 destrezas', activities: 'Salidas, observación, diario.', technique: 'Aprendizaje Basado en Problemas (ABP)', criteria: 'Igual al plan', status: 'active' },
    { id: 'uni-3', name: 'Unidad 3 — Mi cuerpo y el autocuidado',         scope: 'Corporal / Autocuidado', weeks: 4, groupIds: ['gpo-inicial-a'],
      objectives: 'Conocer y cuidar el cuerpo. Hábitos de higiene, alimentación y riesgos.', skills: '6 destrezas', activities: 'Rutinas, láminas, experimentos.', technique: 'Organizadores gráficos', criteria: 'Igual al plan', status: 'active' },
    { id: 'uni-4', name: 'Unidad 4 — Cuidado del entorno compartido',     scope: 'Socio-afectivo / Entorno', weeks: 3, groupIds: ['gpo-cuarto-a'],
      objectives: 'Responsabilidad compartida sobre espacios comunes', skills: '4 destrezas', activities: 'Proyectos, murales,垃圾分类.', technique: 'Mapas conceptuales', criteria: 'Igual al plan', status: 'archived' }
  ];
  units.forEach(u => unitsRepo.save(u));

  // 5. Algunas evaluaciones y fichas (para que los reportes tengan datos)
  const seedEval = (studentId, groupId, unitId, criteria, obs = '', daysAgo = 5) => {
    evaluationsRepo.save({
      studentId, groupId, unitId,
      date: Date.now() - daysAgo * 86400000,
      criteria, observations: obs
    });
  };
  const seedMon = (studentId, groupId, unitId, fields, daysAgo = 4) => {
    monitoringRepo.save({
      studentId, groupId, unitId,
      date: Date.now() - daysAgo * 86400000,
      fields
    });
  };

  seedEval('std-1', 'gpo-inicial-a', 'uni-3', { clasificacion:'L', seriacion:'L', construccion:'EP', pensamiento:'L', metacognicion:'EP' }, 'Buen avance en clasificación y seriación.', 5);
  seedEval('std-2', 'gpo-inicial-a', 'uni-3', { clasificacion:'EP', seriacion:'L', construccion:'L', pensamiento:'EP', metacognicion:'I' }, 'Necesita refuerzo en metacognición.', 5);
  seedEval('std-3', 'gpo-inicial-a', 'uni-3', { clasificacion:'L', seriacion:'L', construccion:'L', pensamiento:'L', metacognicion:'EP' }, 'Excelente desempeño general.', 5);
  seedEval('std-4', 'gpo-inicial-a', 'uni-3', { clasificacion:'EP', seriacion:'I', construccion:'I', pensamiento:'EP', metacognicion:'I' }, 'Requiere atención integral.', 4);
  seedEval('std-5', 'gpo-inicial-a', 'uni-3', { clasificacion:'L', seriacion:'EP', construccion:'EP', pensamiento:'L', metacognicion:'EP' }, 'Avance sostenido.', 4);
  seedEval('std-6', 'gpo-inicial-a', 'uni-3', { clasificacion:'EP', seriacion:'I', construccion:'I', pensamiento:'I', metacognicion:'I' }, 'En proceso inicial.', 3);

  seedMon('std-1', 'gpo-inicial-a', 'uni-3', {
    clasificacion:   { level:'L',  observations:'Clasifica correctamente.',  support:'Juegos de atributos combinados.' },
    seriacion:       { level:'EP', observations:'Sigue 2-3 pasos con guía.', support:'Patrones con material concreto.' },
    asimilacion:     { level:'EP', observations:'Relaciona con su entorno.', support:'Analogías cotidianas.' },
    justificacion:   { level:'EP', observations:'Explica con argumentos simples.', support:'Preguntas "por qué".' },
    autorregulacion: { level:'I',  observations:'Requiere acompañamiento.', support:'Rutinas visuales y pausas activas.' }
  }, 4);
}
