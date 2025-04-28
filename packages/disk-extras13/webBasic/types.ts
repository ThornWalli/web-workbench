import type FsItem from '@web-workbench/core/classes/FileSystem/Item';
import type { ItemModel } from '@web-workbench/core/classes/MenuItem';
import type { CONFIG_NAMES as WINDOWS_CONFIG_NAMES } from '@web-workbench/core/classes/modules/Windows/utils';
import type { CallbackMessage } from '@web-workbench/core/classes/BasicInterpreter';

export enum CONFIG_NAMES {
  WEB_BASIC_SHOW_PREVIEW = 'extras13_web_basic_show_preview'
}

export enum PROPERTY {
  CONTENT = 'content',
  OUTPUT_TYPE = 'type'
}

export interface Value extends ItemModel {
  [PROPERTY.CONTENT]: string;
  [PROPERTY.OUTPUT_TYPE]?: string;
  [WINDOWS_CONFIG_NAMES.HAS_WINDOW_OUTPUT]?: boolean;
}

export interface Model {
  value: Value;
  output: CallbackMessage[];
  fsItem?: FsItem;
  openValue?: Value;
  actions?: {
    reset: () => void;
    focus: () => void;
    close: () => void;
    togglePreview: (toggle?: boolean) => void;
  };
}

declare module '@web-workbench/core/classes/Config' {
  interface ConfigObservable {
    [CONFIG_NAMES.WEB_BASIC_SHOW_PREVIEW]: boolean;
  }
}
