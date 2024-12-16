export const autoEllipsis = (text, length) => {
  return text.length > length ? text.slice(0, length - 1) + '…' : text;
};
export const autoShort = (text, length) => {
  return text.length > length ? text.slice(0, length - 1) + '.' : text;
};

/**
 * @param {String} text
 * @param {Number} length
 * @param {String} char
 */
export const fillTextStart = (text, length, char = ' ') => {
  return String(text).padStart(length, char);
};
/**
 * @param {String} text
 * @param {Number} length
 * @param {String} char
 */
export const fillTextEnd = (text, length, char = ' ') => {
  return String(text).padEnd(length, char);
};
