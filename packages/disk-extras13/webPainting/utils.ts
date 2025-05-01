import { CONFIG_NAMES } from './types';

export function getDefaultConfig() {
  return {
    [CONFIG_NAMES.WEB_PAINTING_DISPLAY_BACKGROUND]: '#CCCCCC',
    [CONFIG_NAMES.WEB_PAINTING_DISPLAY_FOREGROUND]: '#FFFFFF'
  };
}
