/**
 * Script mejorado para la página del Dr. Sebastián Jiménez
 */

const CONFIG = {
  whatsappPhone: '529613757067',
  animationDuration: 300,
  formValidation: true,
};

const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const form = document.querySelector('.appointment-form');
const formNote = document.querySelector('.form-note');

// Navegación móvil
function initNavigation() {
  if (!navToggle || !nav) return;

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Validación de formulario
function validateForm() {
  if (!form) return;

  const fields = {
    name: document.getElementById('name'),
    phone: document.getElementById('phone'),
    service: document.getElementById('service'),
  };

  const validators = {
    name: (value) => {
      if (value.trim().length < 3) {
        return 'El nombre debe tener al menos 3 caracteres';
      }
      return '';
    },
    phone: (value) => {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(value)) {
        return 'El teléfono debe tener exactamente 10 dígitos';
      }
      return '';
    },
    service: (value) => {
      if (!value) {
        return 'Selecciona un servicio';
      }
      return '';
    },
  };

  // Validar en tiempo real
  Object.entries(fields).forEach(([key, field]) => {
    if (!field) return;

    field.addEventListener('blur', () => {
      const error = validators[key](field.value);
      const errorElement = document.getElementById(`${key}-error`);
      if (errorElement) {
        errorElement.textContent = error;
        field.setAttribute('aria-invalid', error ? 'true' : 'false');
      }
    });

    field.addEventListener('input', () => {
      const errorElement = document.getElementById(`${key}-error`);
      if (errorElement && errorElement.textContent) {
        const error = validators[key](field.value);
        errorElement.textContent = error;
      }
    });
  });

  // Validar al enviar
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let hasErrors = false;

    Object.entries(fields).forEach(([key, field]) => {
      const error = validators[key](field.value);
      if (error) hasErrors = true;
      const errorElement = document.getElementById(`${key}-error`);
      if (errorElement) {
        errorElement.textContent = error;
        field.setAttribute('aria-invalid', error ? 'true' : 'false');
      }
    });

    if (!hasErrors) {
      submitForm();
    } else {
      formNote.textContent = 'Por favor, corrige los errores en el formulario';
      formNote.style.color = '#dc2626';
    }
  });
}

// Contador de caracteres
function initCharacterCounter() {
  const textarea = document.getElementById('message');
  const charCount = document.querySelector('.char-count');

  if (!textarea || !charCount) return;

  textarea.addEventListener('input', () => {
    charCount.textContent = `${textarea.value.length}/500`;
  });
}

// Enviar formulario
function submitForm() {
  if (!form) return;

  const formData = new FormData(form);
  const name = formData.get('name');
  const service = formData.get('service');
  const message = formData.get('message');

  let whatsappMessage = `Hola, soy ${name}. Quiero agendar una cita para: ${service}.`;
  if (message) whatsappMessage += ` ${message}`;

  const whatsappUrl = `https://api.whatsapp.com/send/?phone=${CONFIG.whatsappPhone}&text=${encodeURIComponent(whatsappMessage)}&type=phone_number&app_absent=0`;

  formNote.textContent = '✓ Solicitud preparada. Te llevaremos a WhatsApp para confirmar.';
  formNote.style.color = '#17a65a';

  setTimeout(() => window.open(whatsappUrl, '_blank', 'noopener,noreferrer'), 500);
  
  setTimeout(() => {
    form.reset();
    formNote.textContent = '';
    document.querySelectorAll('.form-error').forEach((el) => {
      el.textContent = '';
    });
    document.querySelectorAll('input, select').forEach((field) => {
      field.setAttribute('aria-invalid', 'false');
    });
    document.querySelector('.char-count').textContent = '0/500';
  }, 1500);
}

// Inicializar
function init() {
  initNavigation();
  validateForm();
  initCharacterCounter();
  console.log('✓ Página del Dr. Sebastián Jiménez inicializada correctamente');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
