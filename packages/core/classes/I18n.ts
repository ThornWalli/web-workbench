export interface NestedJSON {
  [key: string]: string | NestedJSON;
}

export default class I18n {
  private lang: NestedJSON;

  constructor(language: NestedJSON | unknown) {
    this.lang = language as NestedJSON;
  }

  t(
    key: string,
    {
      overrides = {},
      default: defaultValue
    }: {
      overrides?: Record<string, string | number>;
      default?: string;
    } = {}
  ) {
    const value = key.split('.').reduce<NestedJSON | string>((o, i) => {
      if (typeof o === 'object' && o[i]) {
        return o[i];
      } else {
        return defaultValue || key;
      }
    }, this.lang);

    if (typeof value !== 'string') {
      throw new Error(`Translation for key "${key}" not found`);
    }

    return Object.entries(overrides).reduce<string>((result, [key, value]) => {
      return result.replace(`{{${key}}}`, String(value));
    }, value);
  }
}
