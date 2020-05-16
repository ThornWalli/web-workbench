
export const CONFIG_NAMES = {
  DOCUMENT_EDITOR_SHOW_PREVIEW: 'workbench13_DOCUMENT_EDITOR_SHOW_PREVIEW'
};

export const CONFIG_DEFAULTS = {
  [CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW]: true
};

export const PROPERTY = {
  OUTPUT_TYPE: 'type',
  OPEN_MAXIMIZED: 'openMaximized',
  CONTENT: 'content',
  FONT_FAMILY: 'fontFamily'
};

export const FONT_TYPES = {
  BuiltIn: 'Built-In',
  Serif: 'Serif',
  SansSerif: 'Sans-Serif',
  Monospace: 'Monospace'
};
export const FONTS = {
  BuiltIn: {
    'Amiga Topaz 13': '"Amiga Topaz 13"',
    'Amiga Topaz 13 Console': '"Amiga Topaz 13 Console", "Amiga Topaz 13", sans-serif'
  },
  Serif: {
    Georgia: 'Georgia, serif',
    'Palatino Linotype': '"Palatino Linotype", "Book Antiqua", Palatino, serif',
    'Times New Roman': '"Times New Roman", Times, serif'
  },
  SansSerif: {
    Arial: 'Arial, Helvetica, sans-serif',
    'Arial Black': '"Arial Black", Gadget, sans-serif',
    'Comic Sans MS': '"Comic Sans MS", cursive, sans-serif',
    Impact: 'Impact, Charcoal, sans-serif',
    'Lucida Sans Unicode': '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
    Tahoma: 'Tahoma, Geneva, sans-serif',
    'Trebuchet MS': '"Trebuchet MS", Helvetica, sans-serif',
    Verdana: 'Verdana, Geneva, sans-serif'
  },
  Monospace: {
    'Courier New': '"Courier New", Courier, monospace',
    'Lucida Console': '"Lucida Console", Monaco, monospace'
  }
};
