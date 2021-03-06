import { ipoint } from '@js-basics/vector';
import { domReady } from '@/web-workbench/services/dom';
import Module from '../../Module';
import { PaletteTheme, PALETTE_THEMES, DEFAULT_PALETTE_THEME } from '../../Theme';
import { CONFIG_NAMES as CORE_CONFIG_NAMES } from '../../Core/utils';
import { PointerA as CursorPointerA, PointerB as CursorPointerB, Crosshair as CursorCrosshair, Wait as CursorWait, CURSOR_TYPES } from '../../Cursor';
import commands from './commands';

class Cursor {
  #wait;
  #tmp;
  #default;
  current;

  constructor () {
    this.#wait = this.getCursor(CURSOR_TYPES.WAIT);
    this.current = this.#default = this.getCursor(CURSOR_TYPES.POINTER_1);
  }

  setWait (wait) {
    if (!this.#tmp && wait) {
      this.#tmp = this.current;
      this.current = this.#wait;
    } else {
      this.current = this.#tmp;
      this.#tmp = null;
    }
  }

  getCursor (type) {
    return new {
      [CURSOR_TYPES.POINTER_1]: CursorPointerA,
      [CURSOR_TYPES.POINTER_2]: CursorPointerB,
      [CURSOR_TYPES.WAIT]: CursorWait,
      [CURSOR_TYPES.CROSSHAIR]: CursorCrosshair
    }[String(type)]();
  }

  setCurrent (type) {
    if (!type) {
      this.current = this.#default;
    } else {
      this.current = this.getCursor(type);
    }
  }
}

export default class Screen extends Module {
  static NAME = 'Screen';

  defaultTheme;

  cursor = new Cursor()

  #contentEl;
  sizes = {
    content: ipoint(0, 0)
  };

  positions = {
    content: ipoint(0, 0)
  };

  screenLayout = {
    size: ipoint(0, 0),
    position: ipoint(0, 0)
  }

  contentLayout = {
    size: ipoint(0, 0),
    position: ipoint(0, 0)
  }

  constructor (options) {
    const { core, contentEl } = Object.assign({ core: null, contentEl: null }, options);
    super({ commands, core });

    this.#contentEl = contentEl;

    this.defaultTheme = this.currentTheme = this.getDefaultTheme();

    if (window === undefined) {
      throw new Error('ScreenControl is only for Browser');
    }
    domReady.then(this.onReady.bind(this)).catch((err) => {
      throw err;
    });
  }

  destroy () {
    global.removeEventListener('resize', this.onResize.bind(this), false);
  }

  updateContentLayout (contentEl) {
    const { x, y, width, height } = contentEl.getBoundingClientRect();
    this.contentLayout = {
      size: ipoint(width, height),
      position: ipoint(x, y)
    };
  }

  updateScreenLayout (contentEl) {
    const { x, y, width, height } = contentEl.getBoundingClientRect();
    this.screenLayout = {
      size: ipoint(width, height),
      position: ipoint(x, y)
    };
  }

  getDefaultTheme () {
    const theme = this.core.config.get(CORE_CONFIG_NAMES.THEME) || PALETTE_THEMES[String(DEFAULT_PALETTE_THEME)];
    return new PaletteTheme('current', theme);
  }

  setTheme (theme) {
    return (this.currentTheme = (theme || this.getDefaultTheme()));
  }

  // events

  onReady () {
    global.addEventListener('resize', this.onResize.bind(this), false);
    this.onResize();
  }

  onResize () {
    if (this.#contentEl) {
      const { x, y, width, height } = this.#contentEl.getBoundingClientRect();
      this.positions.content = ipoint(x, y);
      this.sizes.content = ipoint(width, height);
    }
  }
}

// eslint-disable-next-line no-empty-function
global.oncontextmenu = (e) => {
  e.preventDefault();
};
