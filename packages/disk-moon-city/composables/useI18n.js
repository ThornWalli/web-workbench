import lang from '../lang/de.json';
export default function useI18n() {
  return {
    t: (key, { default: defaultValue } = {}) =>
      key.split('.').reduce((o, i) => o[i] || defaultValue || key, lang)
  };
}
