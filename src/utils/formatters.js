/**
 * Formatter Functions
 * Format data untuk UI display
 */

/**
 * Format score/percentage
 * @param {number} score - Score value
 * @param {number} decimal - Decimal places
 * @returns {string} Formatted score
 */
export const formatScore = (score, decimal = 2) => {
  if (typeof score !== 'number') return '0. 00';
  return score.toFixed(decimal);
};

/**
 * Format percentage dengan symbol
 * @param {number} value - Value
 * @param {number} decimal - Decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimal = 0) => {
  return `${formatScore(value, decimal)}%`;
};

/**
 * Format correct/total count
 * @param {number} correct - Correct answers
 * @param {number} total - Total questions
 * @returns {string} Formatted string
 */
export const formatCorrectCount = (correct, total) => {
  return `${correct} / ${total}`;
};

/**
 * Format quiz title
 * @param {string} title - Quiz title
 * @returns {string} Formatted title
 */
export const formatQuizTitle = (title) => {
  if (!title) return 'Quiz';
  return title.length > 50 ? `${title.substring(0, 50)}...` : title;
};

/**
 * Format tutorial content - remove HTML tags
 * @param {string} html - HTML content
 * @returns {string} Plain text
 */
export const formatHTMLContent = (html) => {
  if (!html) return '';
  
  // Create temp element
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Get text content
  return temp.textContent || temp.innerText || '';
};

/**
 * Format question text
 * @param {string} text - Question text
 * @returns {string} Formatted text
 */
export const formatQuestionText = (text) => {
  if (!text) return '';
  return text.trim();
};

/**
 * Format option text
 * @param {string} text - Option text
 * @param {string|number} optionKey - Option key (A, B, C, D, etc)
 * @returns {string} Formatted option
 */
export const formatOptionText = (text, optionKey = '') => {
  if (!text) return '';
  const prefix = optionKey ?  `${optionKey}.  ` : '';
  return `${prefix}${text. trim()}`;
};

/**
 * Format status badge text
 * @param {boolean|string} status - Status
 * @returns {string} Status text
 */
export const formatStatusBadge = (status) => {
  switch (status) {
    case true:
    case 'completed':
      return '✓ Selesai';
    case false:
    case 'incomplete':
      return '○ Belum';
    case 'in_progress':
      return '◐ Sedang dikerjakan';
    default:
      return '-';
  }
};

/**
 * Format difficulty level
 * @param {string} level - Difficulty level
 * @returns {string} Formatted level
 */
export const formatDifficultyLevel = (level) => {
  const levelMap = {
    easy: 'Mudah',
    medium: 'Sedang',
    hard: 'Sulit',
    expert: 'Ahli',
  };
  return levelMap[level] || level;
};

/**
 * Format feedback sentiment
 * @param {number} score - Score (0-100)
 * @returns {string} Sentiment text
 */
export const formatFeedbackSentiment = (score) => {
  if (score >= 90) return '🌟 Sempurna! ';
  if (score >= 80) return '👏 Sangat Baik! ';
  if (score >= 70) return '✓ Baik';
  if (score >= 60) return '◐ Cukup';
  return '△ Perlu Ditingkatkan';
};

export default {
  formatScore,
  formatPercentage,
  formatCorrectCount,
  formatQuizTitle,
  formatHTMLContent,
  formatQuestionText,
  formatOptionText,
  formatStatusBadge,
  formatDifficultyLevel,
  formatFeedbackSentiment,
};