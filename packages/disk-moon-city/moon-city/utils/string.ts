export const autoEllipsis = (text: string, length: number) => {
  return text.length > length ? text.slice(0, length - 1) + '…' : text;
};
export const autoShort = (text: string, length: number) => {
  return text.length > length ? text.slice(0, length - 1) + '.' : text;
};

/**
 * @param {String} text
 * @param {Number} length
 * @param {String} char
 */
export const fillTextStart = (text: string, length: number, char = ' ') => {
  return String(text).padStart(length, char);
};
/**
 * @param {String} text
 * @param {Number} length
 * @param {String} char
 */
export const fillTextEnd = (text: string, length: number, char = ' ') => {
  return String(text).padEnd(length, char);
};
