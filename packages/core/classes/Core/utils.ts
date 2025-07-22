import { DEFAULT_PALETTE_THEME, PALETTE_THEMES } from '../Theme';
import { CONFIG_NAMES } from './types';
import type { CoreConfig } from './types';

export const BOOT_DURATION = 2000;

function hasDebugQuery(): boolean {
  if (import.meta.server) {
    return false;
  }
  console.log('Checking for debug query parameter');
  return new URL(window.location.href).searchParams.has('debug');
}

const isDev = import.meta.env.DEV || hasDebugQuery();

export function getConfigDefaults(): CoreConfig {
  return {
    [CONFIG_NAMES.SCREEN_1084_FRAME]: !isDev,
    [CONFIG_NAMES.SCREEN_REAL_LOOK]: !isDev,
    [CONFIG_NAMES.SCREEN_SCAN_LINES]: !isDev,
    [CONFIG_NAMES.SCREEN_ACTIVE_ANIMATION]: true,
    [CONFIG_NAMES.BOOT_WITH_SEQUENCE]: true,
    [CONFIG_NAMES.BOOT_WITH_WEBDOS]: true,
    [CONFIG_NAMES.THEME]: PALETTE_THEMES[DEFAULT_PALETTE_THEME],
    [CONFIG_NAMES.FILE_EXTENSION_ASSIGNMENT]: [
      ['md', 'DF0:DocumentReader.app'],
      ['bas', 'DF1:WebBasic.app'],
      ['basic', 'DF1:WebBasic.app']
    ],
    [CONFIG_NAMES.SCREEN_CONFIG]: {
      contrast: 0.5,
      brightness: 0.5,
      color: 0.5,
      sharpness: 0,
      horizontalCentering: 0.5,
      soundVolume: 0.5
    }
  };
}

export const CONFIG_NAME = 'web_workbench_CONFIG';
