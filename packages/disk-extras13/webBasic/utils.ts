import { CONFIG_NAMES as WINDOWS_CONFIG_NAMES } from '@web-workbench/core/modules/Windows/utils';
import { CONFIG_NAME, PROPERTY } from './types';

export function getDefaultConfig() {
  return {
    [CONFIG_NAME.WEB_BASIC_SHOW_PREVIEW]: 'extras13_web_basic_show_preview'
  };
}

export function getDefaultModel() {
  return {
    [WINDOWS_CONFIG_NAMES.HAS_WINDOW_OUTPUT]: false,
    [PROPERTY.CONTENT]: '',
    [PROPERTY.OUTPUT_TYPE]: 'basic'
  };
}
