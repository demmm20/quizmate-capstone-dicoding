/**
 * Helper Functions
 * Reusable utility functions
 */

/**
 * Format waktu ke format readable
 * @param {number} seconds - Seconds
 * @returns {string} Formatted time (e.g., "1 menit 30 detik")
 */
export const formatTime = (seconds) => {
  if (! seconds || seconds < 0) return '0 detik';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds} detik`;
  }

  if (remainingSeconds === 0) {
    return `${minutes} menit`;
  }

  return `${minutes} menit ${remainingSeconds} detik`;
};

/**
 * Calculate quiz time duration
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @returns {number} Duration in seconds
 */
export const calculateDuration = (startTime, endTime = new Date()) => {
  if (!startTime) return 0;
  const duration = (endTime - startTime) / 1000;
  return Math. round(duration);
};

/**
 * Format date ke Indonesian format
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date (e.g., "25 Desember 2024")
 */
export const formatDate = (date) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'Asia/Jakarta'
  };
  return new Intl.DateTimeFormat('id-ID', options).format(new Date(date));
};

/**
 * Format datetime dengan jam
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted datetime
 */
export const formatDateTime = (date) => {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta'
  };
  return new Intl.DateTimeFormat('id-ID', options).format(new Date(date));
};

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} length - Max length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (!text || text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str. slice(1);
};

/**
 * Check if object is empty
 * @param {object} obj - Object to check
 * @returns {boolean}
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * Deep clone object
 * @param {object} obj - Object to clone
 * @returns {object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Sleep/delay
 * @param {number} ms - Milliseconds
 * @returns {Promise}
 */
export const sleep = (ms = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Debounce function
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {function} Debounced function
 */
export const debounce = (func, wait = 500) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {function} func - Function to throttle
 * @param {number} limit - Limit time in ms
 * @returns {function} Throttled function
 */
export const throttle = (func, limit = 500) => {
  let inThrottle;
  return function(... args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export default {
  formatTime,
  calculateDuration,
  formatDate,
  formatDateTime,
  truncateText,
  capitalize,
  isEmpty,
  deepClone,
  sleep,
  debounce,
  throttle,
};