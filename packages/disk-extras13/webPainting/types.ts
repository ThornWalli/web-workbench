import type Item from '@web-workbench/core/classes/FileSystem/Item';
import type App from './lib/App';

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
  };
  fsItem?: Item;
  app: App;
}
