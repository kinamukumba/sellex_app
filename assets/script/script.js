/* Booking demo modal and step navigation */
const modalMask = document.querySelector('.mask');
const containerBook = document.querySelector('.container-book');
const openDemoButtons = document.querySelectorAll('.btn-book-demo');

const steps = containerBook ? Array.from(containerBook.querySelectorAll('.step-book-demo .step')) : [];
const progressBar = containerBook?.querySelector('.step-progress-bar .progress');
const progressText = containerBook?.querySelector('.controle-progress');

let currentStepIndex = 0;

const createError = (message) => {
  if (typeof createAlert === 'function') {
    createAlert(message, 'error');
    return;
  }
  alert(message);
};

const isValidEmail = (value) => {
  const email = String(value || '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (value) => {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length >= 7;
};

const getValue = (el) => (el ? String(el.value || '').trim() : '');

const updateProgress = () => {
  if (!progressBar || !progressText || !steps.length) return;

  const totalSteps = Math.max(1, steps.length - 1); // last step is a confirmation screen
  const stepNumber = Math.min(totalSteps, currentStepIndex + 1);
  const percent = currentStepIndex >= steps.length - 1 ? 100 : Math.round((stepNumber / totalSteps) * 100);

  progressBar.style.width = `${percent}%`;
  progressText.innerHTML = `Passo <i>${stepNumber}</i> de ${totalSteps} <i class="perc">${percent}%</i>`;
};

const showStep = (index) => {
  if (!steps.length) return;
  if (index < 0) index = 0;
  if (index >= steps.length) index = steps.length - 1;

  currentStepIndex = index;

  steps.forEach((step, stepIndex) => {
    step.classList.toggle('active', stepIndex === currentStepIndex);
  });

  updateProgress();
};

const validateStep = (index) => {
  const panel = steps[index];
  if (!panel) return true;

  // 1) Nome completo
  if (index === 0) {
    const nameInput = panel.querySelector('input[placeholder*="Nome"]');
    if (!getValue(nameInput) || getValue(nameInput).length < 3) {
      createError('Por favor, preencha o seu nome completo (mínimo 3 caracteres).');
      return false;
    }
  }

  // 2) Email
  if (index === 1) {
    const emailInput = panel.querySelector('input[type="email"]');
    if (!isValidEmail(getValue(emailInput))) {
      createError('Por favor, informe um e-mail válido.');
      return false;
    }
  }

  // 3) Telefone
  if (index === 2) {
    const phoneInput = panel.querySelector('input[placeholder*="Número de telefone"], input[placeholder*="Telefone"]');
    if (!isValidPhone(getValue(phoneInput))) {
      createError('Por favor, informe um número de telefone válido (mínimo 7 dígitos).');
      return false;
    }
  }

  // 4) Tipo de negócio
  if (index === 3) {
    const select = panel.querySelector('select');
    const value = getValue(select);
    if (!value || value.toLowerCase().includes('tipo de negócio')) {
      createError('Selecione o tipo de negócio.');
      return false;
    }
  }

  // 5) Como você gerencia seus pedidos atualmente?
  if (index === 4) {
    const select = panel.querySelector('select');
    if (!getValue(select)) {
      createError('Selecione como você gerencia seus pedidos atualmente.');
      return false;
    }
  }

  // 6) Volume médio de pedidos
  if (index === 5) {
    const select = panel.querySelector('select');
    if (!getValue(select)) {
      createError('Selecione o volume médio de pedidos por dia.');
      return false;
    }
  }

  // 7) Descrição do desafio
  if (index === 6) {
    const textarea = panel.querySelector('textarea');
    const message = getValue(textarea);
    if (message.length < 10) {
      createError('Por favor, descreva seu maior desafio com pelo menos 10 caracteres.');
      return false;
    }
  }

  return true;
};

const resetBooking = () => {
  const inputs = containerBook.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    if (input.tagName === 'SELECT') {
      input.selectedIndex = 0;
    } else {
      input.value = '';
    }
  });
  showStep(0);
};

const openBookingModal = () => {
  if (!modalMask || !containerBook) return;
  if (containerBook.parentNode !== modalMask) {
    modalMask.appendChild(containerBook);
  }
  modalMask.classList.add('open');
  containerBook.classList.add('open');
  resetBooking();
};

const closeBookingModal = () => {
  if (!modalMask || !containerBook) return;
  modalMask.classList.remove('open');
  containerBook.classList.remove('open');
};

// Open modal
openDemoButtons.forEach((btn) => {
  btn.addEventListener('click', openBookingModal);
});

// Close modal
const closeIcon = containerBook?.querySelector('.close i');
closeIcon?.addEventListener('click', closeBookingModal);
modalMask?.addEventListener('click', (event) => {
  if (event.target === modalMask) closeBookingModal();
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeBookingModal();
});

// Navigation buttons
steps.forEach((step, stepIndex) => {
  const buttons = Array.from(step.querySelectorAll('button[type="button"]'));
  const backBtn = buttons[0];
  const nextBtn = buttons[1];

  backBtn?.addEventListener('click', () => {
    if (stepIndex === 0) {
      closeBookingModal();
      return;
    }
    showStep(stepIndex - 1);
  });

  nextBtn?.addEventListener('click', () => {
    if (!validateStep(stepIndex)) return;

    const isLastStep = stepIndex === steps.length - 1;
    if (isLastStep) {
      closeBookingModal();
      return;
    }

    showStep(stepIndex + 1);
  });
});

// Initialize
showStep(currentStepIndex);
