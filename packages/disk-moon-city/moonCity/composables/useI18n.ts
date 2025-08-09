import I18n from '@web-workbench/core/classes/I18n';
import lang from '../lang/de.json';

const i18n = new I18n(lang);
export default function useI18n() {
  return {
    t: i18n.t.bind(i18n)
  };
}
