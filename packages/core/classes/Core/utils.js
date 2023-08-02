
import { DEFAULT_PALETTE_THEME, PALETTE_THEMES } from '../Theme';

export const BOOT_DURATION = 2000;
export const BOOT_SEQUENCE = {
  NO_DISK: 'no_disk',
  ERROR: 'error',
  READY: 'ready',
  SEQUENCE_1: 0,
  SEQUENCE_2: 1,
  SEQUENCE_3: 2
};

export const CONFIG_NAMES = {
  SCREEN_1084_FRAME: 'core_screen1084Frame',
  SCREEN_REAL_LOOK: 'core_screenRealLook',
  SCREEN_SCAN_LINES: 'core_screenScanlines',
  SCREEN_ACTIVE_ANIMATION: 'core_screenActiveAnimation',
  BOOT_WITH_SEQUENCE: 'core_bootWithSequence',
  BOOT_WITH_WEBDOS: 'core_bootWithWebDos',
  THEME: 'core_theme',
  FILE_EXTENSION_ASSIGNMENT: 'core_fileExtensionAssignment'
};

export const CONFIG_DEFAULTS = {
  [CONFIG_NAMES.SCREEN_1084_FRAME]: true,
  [CONFIG_NAMES.SCREEN_REAL_LOOK]: true,
  [CONFIG_NAMES.SCREEN_SCAN_LINES]: true,
  [CONFIG_NAMES.SCREEN_ACTIVE_ANIMATION]: true,
  [CONFIG_NAMES.BOOT_WITH_SEQUENCE]: true,
  [CONFIG_NAMES.BOOT_WITH_WEBDOS]: true,
  [CONFIG_NAMES.THEME]: PALETTE_THEMES[String(DEFAULT_PALETTE_THEME)],
  [CONFIG_NAMES.FILE_EXTENSION_ASSIGNMENT]: [
    [
      'md', 'DF0:DocumentReader.app'
    ],
    [
      'bas', 'DF1:WebBasic.app'
    ],
    [
      'basic', 'DF1:WebBasic.app'
    ]
  ]
};

export const CONFIG_NAME = 'web_workbench_CONFIG';
