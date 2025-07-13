import type FsItem from '@web-workbench/core/classes/FileSystem/Item';
import type { App } from './lib/App';
import type { IPoint } from '@js-basics/vector';
import type { RESIZE_TYPE } from './types/worker/main';
import type Color from './lib/classes/Color';
import type Window from '@web-workbench/core/classes/Window';
import type Event from '@web-workbench/core/classes/Event';
import type { ToolUseOptions } from './lib/classes/Tool';
import type { TOOL } from './types/select';
import type Theme from '@web-workbench/core/classes/Theme';

export enum PROPERTY {
  CONTENT = 'content',
  OUTPUT_TYPE = 'type'
}

export enum CONFIG_NAMES {
  WEB_PAINT_DOCUMENT_BACKGROUND = 'extras13_web_paint_document_background',
  WEB_PAINT_DISPLAY_BACKGROUND = 'extras13_web_paint_display_background',
  WEB_PAINT_DISPLAY_FOREGROUND = 'extras13_web_paint_display_foreground',
  WEB_PAINT_FIT_IMAGE_ACTIVE = 'extras13_web_paint_fit_image_active',
  WEB_PAINT_FIT_IMAGE_OFFSET = 'extras13_web_paint_fit_image_offset',
  WEB_PAINT_NATIVE_THEME = 'extras13_web_paint_native_theme',
  WEB_PAINT_PALETTES = 'extras13_web_paint_palettes',
  WEB_PAINT_PIXEL_GRID_COLOR = 'extras13_web_paint_display_pixel_grid_color',
  WEB_PAINT_PIXEL_GRID_LINE_WIDTH = 'extras13_web_paint_pixel_grid_line_width',
  WEB_PAINT_PIXEL_GRID_VISIBLE_COUNT = 'extras13_web_paint_pixel_grid_visible_count',
  WEB_PAINT_DEBUG = 'extras13_web_paint_debug'
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
  importClipboard: () => Promise<void>;

  clipboardCopy: () => Promise<void>;

  export: (options: ExportOptions) => Promise<void>;

  useAbstractTool<TOptions extends ToolUseOptions>(
    tool: TOOL,
    options: TOptions
  ): void;
  // saveDocumentSettings: (options: { size: IPoint & number }) => Promise<void>;
  // ###
  close(): void;
  focus(): void;
  openInfo(): Promise<Window>;
  openNewDocument(): Promise<Window>;
  openSettings(): Promise<Window>;
  openExport(): Promise<Window>;
  openDocumentResize(): Promise<Window>;
  openDocumentResizeCanvas(): Promise<Window>;
  openColorPicker(color: Color): Promise<Window>;
  openColorPalette(): Promise<Window>;
  openGridSettings(): Promise<Window>;
  openInsertImage(blob: Blob): Promise<Window>;
  openImageSharpness(): Promise<Window>;
  newDocument(options?: {
    name: string;
    dimension: IPoint & number;
  }): Promise<void>;
  openDocument(): Promise<void>;
  openHelp(): Promise<Window>;
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
