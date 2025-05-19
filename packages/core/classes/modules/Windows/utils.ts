export enum CONFIG_NAMES {
  OPEN_MAXIMIZED = 'openMaximized',
  HAS_WINDOW_OUTPUT = 'has_window_output',
  SHOW_STORAGE_SPACE = 'windowsShowStorageSpace'
}

export const CONFIG_DEFAULTS = {
  [CONFIG_NAMES.HAS_WINDOW_OUTPUT]: false,
  [CONFIG_NAMES.SHOW_STORAGE_SPACE]: true
};
