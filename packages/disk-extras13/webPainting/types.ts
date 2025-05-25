import type Item from '@web-workbench/core/classes/FileSystem/Item';
import type App from './lib/App';
import type Color from './lib/Color';

export enum PROPERTY {
  CONTENT = 'content',
  OUTPUT_TYPE = 'type'
}

export enum CONFIG_NAMES {
  WEB_PAINTING_DISPLAY_BACKGROUND = 'extras13_web_painting_display_background',
  WEB_PAINTING_DISPLAY_FOREGROUND = 'extras13_web_painting_display_foreground'
}

export interface Model {
  actions?: {
    close: () => void;
    focus: () => void;
    openInfo: () => void;
    openDocumentSettings: () => void;
    openDisplaySettings: () => void;
  };
  fsItem?: Item;
  app: App;
}

export interface Options {
  background: Color;
  foreground: Color;
  paletteSteps: Color;
  size: {
    width: number;
    height: number;
  };
}
