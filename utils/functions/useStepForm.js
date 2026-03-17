/*
 * Step-form navigation for the contact form in index.html.
 *
 * - Keeps form panels in sync with the step indicator.
 * - Handles "Avançar" and "Voltar" buttons.
 * - Uses a small fade/slide animation via CSS transitions.
 * - Performs strict step validation and shows errors via createAlert().
 */

(function () {
  const stepForm = document.querySelector('.step-form');
  const steps = stepForm ? Array.from(stepForm.querySelectorAll('.step-w')) : [];
  const panels = Array.from(document.querySelectorAll('.step-form-inputs .form-input'));

  if (!steps.length || !panels.length) return;

  let currentIndex = panels.findIndex((panel) => panel.classList.contains('active'));
  if (currentIndex < 0) currentIndex = 0;

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

  const validateStep = (index) => {
    const panel = panels[index];
    if (!panel) return true;

    // 1) Informações Pessoais
    if (index === 0) {
      const nameInput = panel.querySelector('input[placeholder*="Nome"]');
      const phoneInput = panel.querySelector('input[placeholder*="Telefone"]');
      const emailInput = panel.querySelector('input[type="email"]');

      if (!getValue(nameInput)) {
        createError('Por favor, preencha o seu nome completo.');
        return false;
      }
      if (!isValidPhone(getValue(phoneInput))) {
        createError('Por favor, informe um número de telefone válido.');
        return false;
      }
      if (!isValidEmail(getValue(emailInput))) {
        createError('Por favor, informe um e-mail válido.');
        return false;
      }
    }

    // 2) Detalhes da Empresa (opcionais, mas válidos quando preenchidos)
    if (index === 1) {
      const companyInput = panel.querySelector('input[placeholder*="Empresa"]');
      const roleInput = panel.querySelector('input[placeholder*="Cargo"]');
      const sizeInput = panel.querySelector('input[placeholder*="Tamanho"]');

      const filled = (input) => getValue(input).length > 0;

      if (filled(companyInput) && getValue(companyInput).length < 2) {
        createError('O nome da empresa deve ter pelo menos 2 caracteres.');
        return false;
      }
      if (filled(roleInput) && getValue(roleInput).length < 2) {
        createError('O cargo deve ter pelo menos 2 caracteres.');
        return false;
      }
      if (filled(sizeInput) && getValue(sizeInput).length < 2) {
        createError('Por favor, informe um tamanho de empresa válido.');
        return false;
      }
    }

    // 3) Mensagem
    if (index === 2) {
      const message = getValue(panel.querySelector('textarea'));
      if (message.length < 10) {
        createError('Por favor, descreva suas necessidades com pelo menos 10 caracteres.');
        return false;
      }
    }

    return true;
  };

  const goToStep = (index) => {
    if (index < 0 || index >= panels.length) return;

    currentIndex = index;

    steps.forEach((step, stepIndex) => {
      // marca como "active" todos os steps já percorridos, inclusive o atual
      step.classList.toggle('active', stepIndex <= currentIndex);
    });

    panels.forEach((panel, panelIndex) => {
      panel.classList.toggle('active', panelIndex === currentIndex);
    });
  };

  const form = document.querySelector('.form-contact form');
  if (form) {
    form.addEventListener('submit', (event) => {
      if (!validateStep(currentIndex)) {
        event.preventDefault();
      }
    });
  }

  panels.forEach((panel, panelIndex) => {
    const buttons = Array.from(panel.querySelectorAll('button[type="button"]'));
    const backBtn = buttons[0];
    const nextBtn = buttons[1];

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        goToStep(panelIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (!validateStep(panelIndex)) return;
        goToStep(panelIndex + 1);
      });
    }
  });

  // Allow clicking step indicators (optional)
  steps.forEach((step, stepIndex) => {
    step.addEventListener('click', () => {
      if (stepIndex === currentIndex) return;

      // When moving forward, validate all intermediate steps
      if (stepIndex > currentIndex) {
        for (let i = currentIndex; i < stepIndex; i += 1) {
          if (!validateStep(i)) return;
        }
      }
      goToStep(stepIndex);
    });
  });

  // Ensure initial state is correct
  goToStep(currentIndex);
})();
