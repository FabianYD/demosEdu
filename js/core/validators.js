/* ===================================================================
   VALIDATORS — validación de formularios
   =================================================================== */
export const V = {
  required: (v) => (v != null && String(v).trim() !== '') || 'Este campo es obligatorio',
  minLen: (n) => (v) => (String(v || '').trim().length >= n) || `Mínimo ${n} caracteres`,
  maxLen: (n) => (v) => (String(v || '').length <= n) || `Máximo ${n} caracteres`,
  email:   (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Correo no válido',
  in: (opts) => (v) => opts.includes(v) || 'Opción no válida',
  oneOf: (opts) => (v) => opts.includes(v) || 'Valor no permitido',
  pattern: (re, msg) => (v) => !v || re.test(v) || msg
};

export function runValidators(value, validators) {
  for (const fn of validators) {
    const r = fn(value);
    if (r !== true) return r;
  }
  return null;
}

export function validateForm(form, rules) {
  const errors = {};
  for (const [name, validators] of Object.entries(rules)) {
    const input = form.elements[name];
    if (!input) continue;
    const value = input.type === 'checkbox' ? input.checked
                : input.type === 'radio'    ? (form.querySelector(`input[name="${name}"]:checked`) || {}).value
                : input.value;
    const err = runValidators(value, validators);
    if (err) errors[name] = err;
  }
  return errors;
}

export function showFormErrors(form, errors) {
  $$('[data-error]', form).forEach(n => n.remove());
  for (const [name, msg] of Object.entries(errors)) {
    const input = form.elements[name];
    if (!input) continue;
    input.style.borderColor = 'var(--danger, #d24a4a)';
    const small = document.createElement('div');
    small.setAttribute('data-error', name);
    small.style.cssText = 'color:var(--danger);font-size:11px;margin-top:4px';
    small.textContent = msg;
    input.parentNode.appendChild(small);
  }
}

export function clearFormErrors(form) {
  $$('[data-error]', form).forEach(n => n.remove());
  $$('input,select,textarea', form).forEach(i => { i.style.borderColor = ''; });
}
