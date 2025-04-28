import type Item from '@web-workbench/core/classes/FileSystem/Item';
import type { ItemDataContent } from '@web-workbench/core/classes/FileSystem/types';
import type { ItemModel } from '@web-workbench/core/classes/MenuItem';

export enum PROPERTY {
  OUTPUT_TYPE = 'type',
  OPEN_MAXIMIZED = 'openMaximized',
  CONTENT = 'content',
  FONT_FAMILY = 'fontFamily',
  FONT_SIZE = 'fontSize'
}

export enum FONT_TYPES {
  BuiltIn = 'builtIn',
  Serif = 'serif',
  SansSerif = 'sansSerif',
  Monospace = 'monospace'
}

export interface DocumentModel {
  [PROPERTY.OPEN_MAXIMIZED]: boolean;
  [PROPERTY.OUTPUT_TYPE]: string;
  [PROPERTY.CONTENT]: ItemDataContent;
  [PROPERTY.FONT_FAMILY]: string;
  [PROPERTY.FONT_SIZE]: number;
}

export enum CONFIG_NAMES {
  DOCUMENT_EDITOR_SHOW_PREVIEW = 'workbench13_DOCUMENT_EDITOR_SHOW_PREVIEW'
}

export interface Model {
  actions?: {
    close: () => void;
    focus: () => void;
    reset: () => void;
    togglePreview: (toggle?: boolean) => void;
  };
  fsItem?: Item;
  value: DocumentModel & ItemModel;
  [CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW]: boolean;
}

declare module '@web-workbench/core/classes/Config' {
  interface ConfigObservable {
    [CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW]: boolean;
  }
}
