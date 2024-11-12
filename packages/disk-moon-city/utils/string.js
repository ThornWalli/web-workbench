export const autoEllipsis = (text, length) => {
  return text.length > length ? text.slice(0, length - 1) + '…' : text;
};
