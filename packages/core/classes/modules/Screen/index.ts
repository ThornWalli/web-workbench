import { ipoint } from '@js-basics/vector';
import { ref, reactive, type Ref } from 'vue';
import Module, {
  type ConstructorArgs as ModuleConstructorArgs
} from '../../Module';
import type Theme from '../../Theme';
import {
  PaletteTheme,
  PALETTE_THEMES,
  DEFAULT_PALETTE_THEME,
  type PaletteThemeDescription
} from '../../Theme';
import { CONFIG_NAMES as CORE_CONFIG_NAMES } from '../../Core/utils';
import type { Cursor } from '../../Cursor';
import {
  PointerA as CursorPointerA,
  PointerMoonCity as CursorPointerMoonCity,
  Crosshair as CursorCrosshair,
  Wait as CursorWait,
  CURSOR_TYPES
} from '../../Cursor';
import { domReady } from '../../../services/dom';
import commands from './commands';
import './types';

class CursorWrapper {
  _wait;
  _tmp?: Cursor;
  _default: Cursor;
  current?: Cursor;

  constructor() {
    this._wait = this.getCursor(CURSOR_TYPES.WAIT);
    this.current = this._default = this.getCursor(CURSOR_TYPES.POINTER_1);
  }

  setWait(wait: boolean) {
    if (!this._tmp && wait) {
      this._tmp = this.current;
      this.current = this._wait;
    } else {
      this.current = this._tmp;
      this._tmp = undefined;
    }
  }

  getCursor(type: string) {
    return new {
      [CURSOR_TYPES.POINTER_1]: CursorPointerA,
      [CURSOR_TYPES.POINTER_MOONCITY]: CursorPointerMoonCity,
      [CURSOR_TYPES.WAIT]: CursorWait,
      [CURSOR_TYPES.CROSSHAIR]: CursorCrosshair
    }[type]();
  }

  setCurrent(type: string) {
    console.log('setCurrent', type);
    if (!type) {
      this.current = this._default;
    } else {
      this.current = this.getCursor(type);
    }
  }
}
export default class Screen extends Module {
  static NAME = 'Screen';

  defaultTheme: Ref<Theme | undefined> = ref(undefined);
  currentTheme: Ref<Theme | undefined> = ref(undefined);

  cursor = reactive(new CursorWrapper());

  contentEl?: HTMLElement;
  sizes = {
    content: ipoint(0, 0)
  };

  positions = {
    content: ipoint(0, 0)
  };

  screenLayout = {
    size: ipoint(0, 0),
    position: ipoint(0, 0)
  };

  contentLayout = {
    size: ipoint(0, 0),
    position: ipoint(0, 0)
  };

  constructor(options: ModuleConstructorArgs) {
    const { core, contentEl } = {
      contentEl: undefined,
      ...options
    };
    super({ name: 'Screen', commands, core });

    this.contentEl = contentEl;

    this.defaultTheme.value = this.currentTheme.value = this.getDefaultTheme();

    if (window === undefined) {
      throw new Error('ScreenControl is only for Browser');
    }
    domReady.then(this.onReady.bind(this)).catch(err => {
      throw err;
    });
  }

  override destroy() {
    window.removeEventListener('resize', this.onResize.bind(this), false);
  }

  updateContentLayout(contentEl: HTMLElement) {
    const { x, y, width, height } = contentEl.getBoundingClientRect();
    this.contentLayout = {
      size: ipoint(width, height),
      position: ipoint(x, y)
    };
  }

  updateScreenLayout(contentEl: HTMLElement) {
    const { x, y, width, height } = contentEl.getBoundingClientRect();
    this.screenLayout = {
      size: ipoint(width, height),
      position: ipoint(x, y)
    };
  }

  getDefaultTheme() {
    const theme =
      this.core.config.get<PaletteThemeDescription>(CORE_CONFIG_NAMES.THEME) ||
      PALETTE_THEMES[DEFAULT_PALETTE_THEME];

    return new PaletteTheme('current', theme);
  }

  setTheme(theme?: Theme) {
    return (this.currentTheme.value = theme || this.getDefaultTheme());
  }

  // events

  onReady() {
    window.addEventListener('resize', this.onResize.bind(this), false);
    this.onResize();
  }

  onResize() {
    if (this.contentEl) {
      const { x, y, width, height } = this.contentEl.getBoundingClientRect();
      this.positions.content = ipoint(x, y);
      this.sizes.content = ipoint(width, height);
    }
  }
}

window.oncontextmenu = e => {
  e.preventDefault();
};
