export function formatFilenameDate(date) {
  return date.toISOString().slice(0, 10).replace(/[-]/g, '');
}
