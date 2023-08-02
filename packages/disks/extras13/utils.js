export const CONFIG_NAMES = {
  WEB_BASIC_SHOW_PREVIEW: 'extras13_web_basic_show_preview',
  WEB_PAINTING_DISPLAY_BACKGROUND: 'extras13_web_painting_display_background',
  WEB_PAINTING_DISPLAY_FOREGROUND: 'extras13_web_painting_display_foreground'
};

export const CONFIG_DEFAULTS = {
  [CONFIG_NAMES.WEB_BASIC_SHOW_PREVIEW]: true,
  [CONFIG_NAMES.WEB_PAINTING_DISPLAY_BACKGROUND]: '#CCCCCC',
  [CONFIG_NAMES.WEB_PAINTING_DISPLAY_FOREGROUND]: '#FFFFFF'
};

export const PROPERTY = {
  HAS_WINDOW_OUTPUT: 'has_window_output',
  CONTENT: 'content',
  OUTPUT_TYPE: 'type'
};

export function getBasicDefaultModelValue () {
  return {
    [PROPERTY.HAS_WINDOW_OUTPUT]: false,
    [PROPERTY.CONTENT]: '',
    [PROPERTY.OUTPUT_TYPE]: 'basic'
  };
}
