/**
 * Validator Functions
 * Validate form inputs & data
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {object} { isValid, error }
 */
export const validateUsername = (username) => {
  if (!username) {
    return { isValid: false, error: 'Username tidak boleh kosong' };
  }

  if (username.length < 3) {
    return { isValid: false, error: 'Username minimal 3 karakter' };
  }

  if (username. length > 20) {
    return { isValid: false, error: 'Username maksimal 20 karakter' };
  }

  // Only alphanumeric and underscore
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (! usernameRegex.test(username)) {
    return { isValid: false, error: 'Username hanya boleh mengandung huruf, angka, dan underscore' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {object} { isValid, error }
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password tidak boleh kosong' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'Password minimal 6 karakter' };
  }

  if (password.length > 50) {
    return { isValid: false, error: 'Password maksimal 50 karakter' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate full name
 * @param {string} name - Name to validate
 * @returns {object} { isValid, error }
 */
export const validateName = (name) => {
  if (!name) {
    return { isValid: false, error: 'Nama tidak boleh kosong' };
  }

  if (name.length < 3) {
    return { isValid: false, error: 'Nama minimal 3 karakter' };
  }

  if (name.length > 100) {
    return { isValid: false, error: 'Nama maksimal 100 karakter' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate login form
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {object} { isValid, errors }
 */
export const validateLoginForm = (username, password) => {
  const errors = {};

  const usernameValidation = validateUsername(username);
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.error;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate register form
 * @param {string} name - Full name
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {object} { isValid, errors }
 */
export const validateRegisterForm = (name, username, password) => {
  const errors = {};

  const nameValidation = validateName(name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error;
  }

  const usernameValidation = validateUsername(username);
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.error;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation. error;
  }

  return {
    isValid: Object. keys(errors).length === 0,
    errors,
  };
};

/**
 * Check if all answers are answered
 * @param {object} answers - Answers object
 * @param {number} totalQuestions - Total questions
 * @returns {boolean}
 */
export const validateAllAnswersAnswered = (answers, totalQuestions) => {
  return Object. keys(answers).length === totalQuestions;
};

export default {
  validateEmail,
  validateUsername,
  validatePassword,
  validateName,
  validateLoginForm,
  validateRegisterForm,
  validateAllAnswersAnswered,
};