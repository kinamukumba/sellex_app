/**
 * ========================================
 * VALIDAÇÕES DE INPUT PARA FRONTEND
 * ========================================
 * Conjunto completo de funções para validar
 * dados de entrada do usuário de forma segura
 */

/**
 * Valida nome completo
 * - Mínimo 3 caracteres
 * - Máximo 100 caracteres
 * - Apenas letras e espaços (sem números ou caracteres especiais)
 * - Deve conter pelo menos 2 palavras
 * @param {string} nome - Nome completo do usuário
 * @returns {object} { isValid: boolean, message: string }
 */
function validateFullName(nome) {
  // Remove espaços extras
  nome = nome.trim().replace(/\s+/g, ' ');

  // Validações
  if (!nome || nome.length === 0) {
    return { isValid: false, message: 'Nome completo é obrigatório' };
  }

  if (nome.length < 3) {
    return { isValid: false, message: 'Nome deve ter no mínimo 3 caracteres' };
  }

  if (nome.length > 100) {
    return { isValid: false, message: 'Nome não pode exceder 100 caracteres' };
  }

  // Apenas letras e espaços
  if (!/^[a-záéíóúàãõâêôç\s]+$/i.test(nome)) {
    return {
      isValid: false,
      message: 'Nome deve conter apenas letras e espaços'
    };
  }

  // Deve ter pelo menos 2 palavras (nome e sobrenome)
  const words = nome.split(' ').filter(word => word.length > 0);
  if (words.length < 2) {
    return {
      isValid: false,
      message: 'Insira seu nome completo (nome e sobrenome)'
    };
  }

  return { isValid: true, message: 'Nome válido' };
}

/**
 * Valida endereço de email
 * - Formato padrão de email
 * - Máximo 254 caracteres (padrão RFC)
 * - Verificação básica de domínio válido
 * @param {string} email - Endereço de email
 * @returns {object} { isValid: boolean, message: string }
 */
function validateEmail(email) {
  email = email.trim().toLowerCase();

  if (!email || email.length === 0) {
    return { isValid: false, message: 'Email é obrigatório' };
  }

  if (email.length > 254) {
    return { isValid: false, message: 'Email muito longo' };
  }

  // Regex para validação de email (RFC 5322 simplificado)
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: 'Formato de email inválido (ex: usuario@email.com)'
    };
  }

  // Verificações adicionais
  if (email.startsWith('.') || email.endsWith('.')) {
    return { isValid: false, message: 'Email inválido' };
  }

  if (email.includes('..')) {
    return { isValid: false, message: 'Email inválido' };
  }

  return { isValid: true, message: 'Email válido' };
}

/**
 * Valida número de telefone de Angola
 * - Formato: +244 ou 244 ou código de área de 2 dígitos (9xx)
 * - Total de 9 dígitos após o código
 * - Operadoras: 921, 922, 923, 924, 925, 926, 927, 928, 929
 * @param {string} telefone - Número de telefone
 * @returns {object} { isValid: boolean, message: string }
 */
function validateAngolPhoneNumber(telefone) {
  // Remove espaços, hífens, parênteses e sinais de +
  telefone = telefone
    .trim()
    .replace(/[\s\-()]/g, '')
    .replace(/\+/g, '');

  if (!telefone || telefone.length === 0) {
    return { isValid: false, message: 'Telefone é obrigatório' };
  }

  // Apenas números
  if (!/^\d+$/.test(telefone)) {
    return {
      isValid: false,
      message: 'Telefone deve conter apenas números'
    };
  }

  // Remove código do país se presente
  let phoneNumber = telefone;
  if (telefone.startsWith('244')) {
    phoneNumber = telefone.substring(3);
  } else if (telefone.startsWith('00244')) {
    phoneNumber = telefone.substring(5);
  }

  // Verifica comprimento (9 dígitos)
  if (phoneNumber.length !== 9) {
    return {
      isValid: false,
      message: 'Número de telefone deve ter 9 dígitos'
    };
  }

  // Verifica se começa com código válido da Angola (9)
  if (!phoneNumber.startsWith('9')) {
    return {
      isValid: false,
      message: 'Telefone de Angola deve começar com 9'
    };
  }

  // Verifica operadoras válidas (921-929)
  const firstThreeDigits = phoneNumber.substring(0, 3);
  const validOperators = ['921', '922', '923', '924', '925', '926', '927', '928', '929'];

  if (!validOperators.includes(firstThreeDigits)) {
    return {
      isValid: false,
      message: 'Operadora de telefone não reconhecida'
    };
  }

  return { isValid: true, message: 'Telefone válido' };
}

/**
 * Valida senha forte
 * Requisitos:
 * - Mínimo 8 caracteres
 * - Máximo 128 caracteres
 * - Pelo menos 1 letra maiúscula
 * - Pelo menos 1 letra minúscula
 * - Pelo menos 1 número
 * - Pelo menos 1 caractere especial (!@#$%^&*)
 * @param {string} senha - Senha do usuário
 * @returns {object} { isValid: boolean, message: string, strength: string }
 */
function validateStrongPassword(senha) {
  if (!senha) {
    return {
      isValid: false,
      message: 'Senha é obrigatória',
      strength: 'none'
    };
  }

  if (senha.length < 8) {
    return {
      isValid: false,
      message: 'Senha deve ter no mínimo 8 caracteres',
      strength: 'very-weak'
    };
  }

  if (senha.length > 128) {
    return {
      isValid: false,
      message: 'Senha não pode exceder 128 caracteres',
      strength: 'none'
    };
  }

  // Verificações
  const hasUpperCase = /[A-Z]/.test(senha);
  const hasLowerCase = /[a-z]/.test(senha);
  const hasNumbers = /\d/.test(senha);
  const hasSpecialChar = /[!@#$%^&*()_+=\[\]{};:'",.<>?\\|`~-]/.test(senha);

  // Conta requisitos atendidos
  const requirementsMet = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(
    Boolean
  ).length;

  // Determina força da senha
  let strength = 'weak';
  let requirements = [];

  if (!hasUpperCase) requirements.push('letra maiúscula (A-Z)');
  if (!hasLowerCase) requirements.push('letra minúscula (a-z)');
  if (!hasNumbers) requirements.push('número (0-9)');
  if (!hasSpecialChar) requirements.push('caractere especial (!@#$%^&*)');

  if (requirementsMet === 4) {
    strength = 'strong';
  } else if (requirementsMet === 3) {
    strength = 'medium';
  } else if (requirementsMet === 2) {
    strength = 'weak';
  } else {
    strength = 'very-weak';
  }

  if (requirements.length > 0) {
    return {
      isValid: false,
      message: `Senha deve conter: ${requirements.join(', ')}`,
      strength: strength
    };
  }

  return {
    isValid: true,
    message: 'Senha forte!',
    strength: 'strong'
  };
}

/**
 * Valida data de nascimento
 * - Formato: DD/MM/YYYY ou YYYY-MM-DD
 * - Usuário deve ter no mínimo 18 anos
 * - Data não pode ser no futuro
 * - Data válida no calendário
 * @param {string} dataNascimento - Data de nascimento
 * @returns {object} { isValid: boolean, message: string, age: number }
 */
function validateBirthDate(dataNascimento) {
  if (!dataNascimento || dataNascimento.length === 0) {
    return {
      isValid: false,
      message: 'Data de nascimento é obrigatória',
      age: null
    };
  }

  let date = null;
  let dateStr = dataNascimento.trim();

  // Tenta interpretar diferentes formatos
  // Formato: DD/MM/YYYY
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts.map(p => parseInt(p, 10));
      date = new Date(year, month - 1, day);
    }
  }
  // Formato: YYYY-MM-DD
  else if (dateStr.includes('-')) {
    date = new Date(dateStr);
  }

  // Valida se a data é válida
  if (!date || isNaN(date.getTime())) {
    return {
      isValid: false,
      message: 'Formato de data inválido (use DD/MM/YYYY ou YYYY-MM-DD)',
      age: null
    };
  }

  // Verifica se a data não é no futuro
  const today = new Date();
  if (date > today) {
    return {
      isValid: false,
      message: 'Data de nascimento não pode ser no futuro',
      age: null
    };
  }

  // Calcula a idade
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }

  // Verifica idade mínima de 18 anos
  if (age < 18) {
    return {
      isValid: false,
      message: 'Você deve ter no mínimo 18 anos de idade',
      age: age
    };
  }

  // Verifica se a idade é razoável (máximo 150 anos)
  if (age > 150) {
    return {
      isValid: false,
      message: 'Data de nascimento parece inválida',
      age: age
    };
  }

  return {
    isValid: true,
    message: 'Data de nascimento válida',
    age: age
  };
}

/**
 * Válida todos os campos do formulário de registro
 * @param {object} formData - Objeto com os dados do formulário
 * @returns {object} { isValid: boolean, errors: object }
 */
function validateRegistrationForm(formData) {
  const errors = {};
  let isFormValid = true;

  // Valida nome
  const nameValidation = validateFullName(formData.nome || '');
  if (!nameValidation.isValid) {
    errors.nome = nameValidation.message;
    isFormValid = false;
  }

  // Valida email
  const emailValidation = validateEmail(formData.email || '');
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
    isFormValid = false;
  }

  // Valida telefone
  const phoneValidation = validateAngolPhoneNumber(formData.telefone || '');
  if (!phoneValidation.isValid) {
    errors.telefone = phoneValidation.message;
    isFormValid = false;
  }

  // Valida senha
  const passwordValidation = validateStrongPassword(formData.senha || '');
  if (!passwordValidation.isValid) {
    errors.senha = passwordValidation.message;
    isFormValid = false;
  }

  // Valida data de nascimento
  const birthDateValidation = validateBirthDate(formData.dataNascimento || '');
  if (!birthDateValidation.isValid) {
    errors.dataNascimento = birthDateValidation.message;
    isFormValid = false;
  }

  return {
    isValid: isFormValid,
    errors: errors
  };
}

// ========================================
// EXPORTAÇÕES (para uso em outros arquivos)
// ========================================

// Para módulos ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateFullName,
    validateEmail,
    validateAngolPhoneNumber,
    validateStrongPassword,
    validateBirthDate,
    validateRegistrationForm
  };
}