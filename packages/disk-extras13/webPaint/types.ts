import type FsItem from '@web-workbench/core/classes/FileSystem/Item';
import type { App } from './lib/App';
import type { IPoint } from '@js-basics/vector';
import type { RESIZE_TYPE } from './types/main';
import type Color from './lib/classes/Color';
import type Window from '@web-workbench/core/classes/Window';
import type Event from '@web-workbench/core/classes/Event';
import type { ToolUseOptions } from './lib/classes/Tool';
import type { TOOLS } from './types/select';
import type Theme from '@web-workbench/core/classes/Theme';

export enum PROPERTY {
  CONTENT = 'content',
  OUTPUT_TYPE = 'type'
}

export enum CONFIG_NAMES {
  WEB_PAINTING_DISPLAY_BACKGROUND = 'extras13_web_painting_display_background',
  WEB_PAINTING_DISPLAY_FOREGROUND = 'extras13_web_painting_display_foreground',
  WEB_PAINTING_DISPLAY_GRID_COLOR = 'extras13_web_painting_display_grid_color',
  WEB_PAINTING_FIT_IMAGE = 'extras13_web_painting_fit_image',
  WEB_PAINTING_NATIVE_THEME = 'extras13_web_painting_native_theme',
  WEB_PAINTING_PALETTES = 'extras13_web_painting_palettes'
}

export interface ExportOptions {
  filename?: string;
  type: string;
  quality: number;
  resize?: IPoint & number;
}

export enum ORIGIN {
  LEFT_TOP = 'left_top',
  TOP = 'top',
  RIGHT_TOP = 'right_top',
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
  LEFT_BOTTOM = 'left_bottom',
  BOTTOM = 'bottom',
  RIGHT_BOTTOM = 'right_bottom'
}

export interface PromptOptions {
  type: 'text' | 'number' | 'password';
  value?: string | number;
  min?: number;
  max?: number;
  step?: number;
  size?: number;
  text?: string;
  required?: boolean;
}

export interface ModelActions {
  import: (file: File) => Promise<void>;
  export: (options: ExportOptions) => Promise<void>;

  useAbstractTool<TOptions extends ToolUseOptions>(
    tool: TOOLS,
    options: TOptions
  ): void;
  // saveDocumentSettings: (options: { size: IPoint & number }) => Promise<void>;
  // ###
  close(): void;
  focus(): void;
  openInfo(): void;
  openSettings(): void;
  openExport(): void;
  openResize(): void;
  openResizeCanvas(): void;
  openColorPicker(color: Color): Promise<Window>;
  openColorPalette(): void;
  newDocument(): Promise<void>;
  openDocument(): Promise<void>;
  saveDocument(): Promise<void>;
  saveAsDocument(): Promise<void>;
  documentResize(options: {
    dimension: IPoint & number;
    type: RESIZE_TYPE;
  }): Promise<void>;
  documentResizeCanvas(options: {
    dimension: IPoint & number;
    origin: ORIGIN;
  }): Promise<void>;
  // debug
  openDebugColorPickers(): Promise<Window>;
  openDebugColorPicker(): Promise<Window>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prompt<Result = any>(options: PromptOptions): Promise<Event<Result>>;

  openValueInput(options?: {
    type: 'text' | 'number' | 'password';
    value?: string | number;
    min?: number;
    max?: number;
    step?: number;
    size?: number;
    text?: string;
    required?: boolean;
  }): Promise<Window>;

  setTheme(theme?: Theme): void;
}

export interface Model {
  fsItem?: FsItem;
  app: App;
  actions: ModelActions;
}

export interface Options {
  background: ColorRaw;
  foreground: ColorRaw;
  paletteSteps: ColorRaw;
  size: {
    width: number;
    height: number;
  };
}

export type ColorRaw = [number, number, number, number?]; // Alpha ist optional
