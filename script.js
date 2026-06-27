// Configuración Global de la Aplicación
const CONFIG = {
  whatsappPhone: "529610000000", // REEMPLAZAR con el número de WhatsApp real del consultorio
};

// Elementos de la interfaz de usuario
const form = document.getElementById('appointment-form');
const formNote = document.getElementById('form-note');
const textarea = document.getElementById('message');
const charCount = document.querySelector('.char-count');

// Inicializador General
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initFormValidation();
  initCharacterCounter();
  initScrollAnimations();
});

// 1. Navegación fluida al hacer clic en los enlaces del menú
function initNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// 2. Validación Avanzada del Formulario y Conexión Premium con WhatsApp
function initFormValidation() {
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateAllFields()) {
      executeFormSubmission();
    }
  });

  // Validación interactiva en tiempo real mientras el usuario escribe
  ['input', 'change'].forEach(eventType => {
    form.addEventListener(eventType, (e) => {
      if (e.target.required) {
        validateField(e.target);
      }
    });
  });
}

function validateField(field) {
  const errorElement = document.getElementById(`${field.id}-error`);
  if (!errorElement) return true;

  if (!field.value.trim()) {
    errorElement.textContent = 'Este campo es obligatorio para coordinar tu consulta.';
    field.setAttribute('aria-invalid', 'true');
    return false;
  }

  errorElement.textContent = '';
  field.setAttribute('aria-invalid', 'false');
  return true;
}

function validateAllFields() {
  let isValid = true;
  form.querySelectorAll('[required]').forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });
  return isValid;
}

function executeFormSubmission() {
  const formData = new FormData(form);
  const name = formData.get('name');
  const service = formData.get('service');
  const message = formData.get('message');

  // Enriquecimiento inteligente del mensaje según el servicio
  let contextualNote = '';
  if (service === 'Dolor o urgencia') {
    contextualNote = ' 🚨 ATENCIÓN PRIORITARIA: El paciente reporta dolor severo o caso de emergencia.';
  } else if (service === 'Tratamiento infantil') {
    contextualNote = ' 👶 Consulta odontopediátrica para menor de edad.';
  }

  let whatsappMessage = `Hola Dr. Sebastián Jiménez, me gustaría agendar una cita.\n\n`;
  whatsappMessage += `*Paciente:* ${name}\n`;
  whatsappMessage += `*Servicio solicitado:* ${service}${contextualNote}\n`;
  
  if (message.trim()) {
    whatsappMessage += `*Notas/Síntomas:* ${message}`;
  }

  const whatsappUrl = `https://api.whatsapp.com/send/?phone=${CONFIG.whatsappPhone}&text=${encodeURIComponent(whatsappMessage)}&type=phone_number&app_absent=0`;

  if (formNote) {
    formNote.textContent = '✓ Solicitud procesada con éxito. Redirigiendo de forma segura a WhatsApp...';
    formNote.style.color = '#17a65a';
  }

  // Apertura asíncrona del chat de WhatsApp
  setTimeout(() => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    resetFormState();
  }, 800);
}

function resetFormState() {
  form.reset();
  if (formNote) formNote.textContent = '';
  if (charCount) charCount.textContent = '0/500';
  form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
  form.querySelectorAll('[aria-invalid]').forEach(el => el.setAttribute('aria-invalid', 'false'));
}

// 3. Contador de Caracteres Dinámico para el Textarea
function initCharacterCounter() {
  if (!textarea || !charCount) return;

  textarea.addEventListener('input', () => {
    const count = textarea.value.length;
    charCount.textContent = `${count}/500`;
    if (count >= 450) {
      charCount.style.color = 'var(--red-500)';
    } else {
      charCount.style.color = 'var(--gray-500)';
    }
  });
}

// 4. Lógica de Animaciones en Scroll de Alto Rendimiento (Intersection Observer)
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (animatedElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Desactivar observador individual una vez animado
      }
    });
  }, observerOptions);

  animatedElements.forEach(element => observer.observe(element));
}
