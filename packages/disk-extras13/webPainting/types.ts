import type { App } from './lib/App';

export enum PROPERTY {
  CONTENT = 'content',
  OUTPUT_TYPE = 'type'
}

export enum CONFIG_NAMES {
  WEB_PAINTING_DISPLAY_BACKGROUND = 'extras13_web_painting_display_background',
  WEB_PAINTING_DISPLAY_FOREGROUND = 'extras13_web_painting_display_foreground'
}

export interface Model {
  app: App;
  actions?: {
    close: () => void;
    focus: () => void;
    openInfo: () => void;
  };
}

export interface Options {
  background: ColorRaw;
  foreground: ColorRaw;
  paletteSteps: ColorRaw;
  size: {
    width: number;
    height: number;
  };
}

export type ColorRaw = [number, number, number, number?]; // Alpha ist optional
