import type { CallbackOptions } from '../BasicInterpreter';

export interface ConfigObservable extends Record<string, unknown> {
  [CONFIG_NAMES.SCREEN_1084_FRAME]: boolean;
  [CONFIG_NAMES.SCREEN_REAL_LOOK]: boolean;
  [CONFIG_NAMES.SCREEN_SCAN_LINES]: boolean;
  [CONFIG_NAMES.SCREEN_ACTIVE_ANIMATION]: boolean;
  [CONFIG_NAMES.BOOT_WITH_SEQUENCE]: boolean;
  [CONFIG_NAMES.BOOT_WITH_WEBDOS]: boolean;
  [CONFIG_NAMES.FILE_EXTENSION_ASSIGNMENT]: string[][];
  [CONFIG_NAMES.SCREEN_CONFIG]: ScreenConfig;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ModuleConfig extends Record<string, unknown> {}

export enum BOOT_SEQUENCE {
  NO_DISK = 'no-disk',
  ERROR = 'error',
  READY = 'ready',
  SEQUENCE_1 = 0,
  SEQUENCE_2 = 1,
  SEQUENCE_3 = 2
}

export enum CONFIG_NAMES {
  SCREEN_1084_FRAME = 'core_screen1084Frame',
  SCREEN_REAL_LOOK = 'core_screenRealLook',
  SCREEN_SCAN_LINES = 'core_screenScanlines',
  SCREEN_ACTIVE_ANIMATION = 'core_screenActiveAnimation',
  BOOT_WITH_SEQUENCE = 'core_bootWithSequence',
  BOOT_WITH_WEBDOS = 'core_bootWithWebDos',
  THEME = 'core_theme',
  FILE_EXTENSION_ASSIGNMENT = 'core_fileExtensionAssignment',
  SCREEN_CONFIG = 'core_screenConfig'
}

export interface ScreenConfig {
  contrast: number;
  brightness: number;
  color: number;
  sharpness: number;
  horizontalCentering: number;
  soundVolume: number;
}

export interface CoreConfig extends ModuleConfig {
  [CONFIG_NAMES.SCREEN_1084_FRAME]: boolean;
  [CONFIG_NAMES.SCREEN_REAL_LOOK]: boolean;
  [CONFIG_NAMES.SCREEN_SCAN_LINES]: boolean;
  [CONFIG_NAMES.SCREEN_ACTIVE_ANIMATION]: boolean;
  [CONFIG_NAMES.BOOT_WITH_SEQUENCE]: boolean;
  [CONFIG_NAMES.BOOT_WITH_WEBDOS]: boolean;
  [CONFIG_NAMES.FILE_EXTENSION_ASSIGNMENT]: string[][];
  [CONFIG_NAMES.SCREEN_CONFIG]: ScreenConfig;
}

export interface ExecuteCallbackOptions extends CallbackOptions {
  show?: boolean;
}

export interface ErrorDescription {
  input?: string;
  message: string;
  stack: string | null;
  code: string;
  userInteraction?: boolean;
}
