const body = document.body;
const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const navList = document.querySelector('[data-nav-list]');

function setMenu(open) {
  body.classList.toggle('menu-open', open);
  menuToggle?.setAttribute('aria-expanded', String(open));
  menuToggle?.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}

menuToggle?.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
navList?.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});

window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 24), { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const diagnosticForm = document.querySelector('#diagnostic-form');
const steps = [...document.querySelectorAll('.form-step')];
const progress = document.querySelector('[data-progress]');
const result = document.querySelector('[data-result]');
let currentStep = 0;

function showStep(index) {
  currentStep = index;
  steps.forEach((step, i) => step.classList.toggle('active', i === index));
  result?.classList.remove('active');
  if (progress) progress.style.width = `${((index + 1) / steps.length) * 100}%`;
}

function validateCurrentStep() {
  const required = [...steps[currentStep].querySelectorAll('[required]')];
  const invalid = required.find((field) => {
    if (field.type === 'radio') {
      return !steps[currentStep].querySelector(`input[name="${field.name}"]:checked`);
    }
    return !field.checkValidity();
  });
  if (invalid) {
    invalid.reportValidity();
    return false;
  }
  return true;
}

document.querySelectorAll('.form-next').forEach((button) => {
  button.addEventListener('click', () => {
    if (validateCurrentStep()) showStep(Math.min(currentStep + 1, steps.length - 1));
  });
});

document.querySelectorAll('.form-back').forEach((button) => {
  button.addEventListener('click', () => showStep(Math.max(currentStep - 1, 0)));
});

document.querySelectorAll('[data-plan]').forEach((link) => {
  link.addEventListener('click', () => {
    const planField = diagnosticForm?.elements.selectedPlan;
    if (planField) planField.value = link.dataset.plan;
  });
});

const recommendations = {
  security: {
    title: 'Fortalece primero tus accesos',
    copy: 'La prioridad inicial es revisar cuentas, permisos, contraseñas distintas y doble verificación, siempre con autorización.',
    plan: 'Inicio Digital · Q200'
  },
  backup: {
    title: 'Protege y organiza tu información',
    copy: 'Conviene identificar los archivos importantes, establecer una frecuencia de respaldo y comprobar la recuperación de un archivo de prueba.',
    plan: 'Protección y Orden · Q300'
  },
  presence: {
    title: 'Construye una presencia digital clara',
    copy: 'Puedes comenzar con una página informativa sencilla y un medio de contacto comprobado, sin desarrollar una plataforma compleja.',
    plan: 'Presencia digital · desde Q250'
  },
  training: {
    title: 'Convierte las buenas prácticas en hábito',
    copy: 'Una capacitación breve puede ayudar al equipo a reconocer mensajes sospechosos y proteger mejor cuentas y códigos de acceso.',
    plan: 'Capacitación básica · Q125'
  },
  support: {
    title: 'Mantén revisiones periódicas',
    copy: 'El seguimiento programado permite revisar respaldos, actualizaciones, accesos y pequeños ajustes dentro de un alcance definido.',
    plan: 'Acompañamiento · Q200/mes'
  },
  unknown: {
    title: 'Empieza con un diagnóstico',
    copy: 'Si todavía no tienes claro el problema, una revisión inicial permite separar lo declarado, lo comprobado y lo que queda por verificar.',
    plan: 'Diagnóstico tecnológico · Q100'
  }
};

diagnosticForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateCurrentStep()) return;
  const data = new FormData(diagnosticForm);
  const recommendation = recommendations[data.get('need')] || recommendations.unknown;
  const selectedPlan = data.get('selectedPlan');
  document.querySelector('[data-result-title]').textContent = recommendation.title;
  document.querySelector('[data-result-copy]').textContent = recommendation.copy;
  document.querySelector('[data-result-plan]').textContent = selectedPlan || recommendation.plan;
  steps.forEach((step) => step.classList.remove('active'));
  result.classList.add('active');
  if (progress) progress.style.width = '100%';
  result.focus();
});

document.querySelector('[data-reset-form]')?.addEventListener('click', () => {
  diagnosticForm.reset();
  showStep(0);
});

const contactForm = document.querySelector('#contact-form');
const contactStatus = document.querySelector('[data-contact-status]');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = new FormData(contactForm).get('name');
  contactStatus.textContent = `Gracias, ${name}. Esta es una demostración: tu solicitud no fue enviada a un servidor.`;
  contactForm.reset();
});
