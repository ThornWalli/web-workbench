import lang from '../lang/de.json';
export default function useI18n() {
  return {
    t: (key, { overrides = {}, default: defaultValue } = {}) => {
      const value = key
        .split('.')
        .reduce((o, i) => o[i] || defaultValue || key, lang);
      return Object.entries(overrides).reduce((result, [key, value]) => {
        return result.replace(`{{${key}}}`, value);
      }, value);
    }
  };
}
