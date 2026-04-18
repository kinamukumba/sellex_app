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

//const BOOK_DEMO_API = './api/book_demo.php';

const getBookingPayload = () => {
  const step = (idx) => steps[idx];
  if (!step) return null;

  return {
    email: getValue(step(0)?.querySelector('input[type="email"]')),
    name: getValue(step(1)?.querySelector('input')),
    phone: getValue(step(2)?.querySelector('input')),
    business_type: getValue(step(3)?.querySelector('select')),
    order_management: getValue(step(4)?.querySelector('select')),
    order_volume: getValue(step(5)?.querySelector('select')),
    challenge: getValue(step(6)?.querySelector('textarea')),
    source_url: window.location.href,
    submitted_at: new Date().toISOString(),
  };
};

const BOOK_DEMO_API = 'https://api.at-investimentos.ao/api/book_demo.php';
const API_KEY = 'SELLEX_2026_SECRET';


const sendBookDemo = async () => {
  const payload = getBookingPayload();

  if (!payload || !payload.name || !payload.email || !payload.phone) {
    createError('Erro interno ao coletar os dados da demo. Tente novamente.');
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(BOOK_DEMO_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error('Resposta inválida do servidor.');
    }

    if (!response.ok) {
      createError(data.message || 'Erro ao agendar demo.');
      return;
    }

    if (data.success) {
      createAlert(data.message || 'Demo agendada com sucesso!', 'success');
      resetBooking();
      closeBookingModal();
    } else {
      createError(data.message || 'Não foi possível agendar a demo.');
    }

  } catch (error) {
    console.error('book-demo error:', error);

    if (error.name === 'AbortError') {
      createError('O servidor demorou muito para responder.');
    } else {
      createError('Erro de rede. Verifique sua conexão.');
    }
  } finally {
    clearTimeout(timeout); // 🔥 GARANTE limpeza sempre
  }
};


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
    const emailInput = panel.querySelector('input[type="email"]');
    if (!isValidEmail(getValue(emailInput))) {
      createError('Por favor, informe um e-mail válido.');
      return false;
    }
  }

  // 2) Email
  if (index === 1) {
    const nameInput = panel.querySelector('input[placeholder*="Nome"]');
    if (!getValue(nameInput) || getValue(nameInput).length < 3) {
      createError('Por favor, preencha o seu nome completo (mínimo 3 caracteres).');
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

//Open modal with quick email input
if (document.querySelector('.book-demo')) {
  document.querySelector('.book-demo').addEventListener('click', () => {
    const emailInputQuick = document.querySelector('.input-email-book .input input[type="email"]');
    if (!isValidEmail(getValue(emailInputQuick))) {
      createError('Por favor, informe um e-mail válido para agendar a demo.');
      return false;
    }
    openBookingModal();
    document.querySelector('.step-book-demo>:nth-child(1) input[type="email"]').value = getValue(emailInputQuick);
  });
}
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

  nextBtn?.addEventListener('click', async () => {
    if (!validateStep(stepIndex)) return;

    const isLastStep = stepIndex === steps.length - 1;
    if (isLastStep) {
      await sendBookDemo();
      return;
    }

    showStep(stepIndex + 1);
  });
});

// Initialize
showStep(currentStepIndex);

// Mobile menu toggle
const iconMenuToggle = document.querySelector('.icon-menu');
const mobileMenu = document.querySelector('.menu');

const closeMobileMenu = () => {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('open');
};

iconMenuToggle?.addEventListener('click', (event) => {
  event.stopPropagation();
  if (!mobileMenu) return;
  mobileMenu.classList.toggle('open');
});

// Close menu when clicking outside or selecting an item
document.addEventListener('click', (event) => {
  if (!mobileMenu?.classList.contains('open')) return;
  if (event.target.closest('.menu') || event.target.closest('.icon-menu')) return;
  closeMobileMenu();
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMobileMenu);
});

mobileMenu?.querySelectorAll('.btn-book-demo').forEach((button) => {
  button.addEventListener('click', closeMobileMenu);
});
