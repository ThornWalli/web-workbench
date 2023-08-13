import langEn from '../locales/en.json';

export const templateContent = langEn;

export function renderTemplate(...args) {
  const value = args.shift();
  return args.reduce((result, value) => result.replace(/%\d+/, value), value);
}
