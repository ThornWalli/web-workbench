export enum SYMBOL {
  DISK_EXTRAS13 = 'disk_extras13',
  WEB_BASIC = 'web_basic',
  WEB_PAINT = 'web_paint',
  GUEST_BOOK = 'guest_book'
}

interface Extras13ThemeColors {
  guestBook: {
    background: string;
    foreground: string;
    author: string;
    link: string;
    unpublished: {
      background: string;
      foreground: string;
    };
    selected: {
      background: string;
      foreground: string;
    };
  };
}

declare module '@web-workbench/core/classes/Theme' {
  export interface DiskThemeDescription {
    extras13?: Extras13ThemeColors;
  }
}
