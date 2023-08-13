import { ipoint } from '@js-basics/vector';
import { ref } from 'vue';
import Module from '../../Module';
import {
  PaletteTheme,
  PALETTE_THEMES,
  DEFAULT_PALETTE_THEME
} from '../../Theme';
import { CONFIG_NAMES as CORE_CONFIG_NAMES } from '../../Core/utils';
import {
  PointerA as CursorPointerA,
  PointerB as CursorPointerB,
  Crosshair as CursorCrosshair,
  Wait as CursorWait,
  CURSOR_TYPES
} from '../../Cursor';
import { domReady } from '../../../services/dom';
import commands from './commands';

class Cursor {
  #wait;
  #tmp;
  #default;
  current = ref(null);

  constructor() {
    this.#wait = this.getCursor(CURSOR_TYPES.WAIT);
    this.current.value = this.#default = this.getCursor(CURSOR_TYPES.POINTER_1);
  }

  setWait(wait) {
    if (!this.#tmp && wait) {
      this.#tmp = this.current.value;
      this.current.value = this.#wait;
    } else {
      this.current.value = this.#tmp;
      this.#tmp = null;
    }
  }

  getCursor(type) {
    return new {
      [CURSOR_TYPES.POINTER_1]: CursorPointerA,
      [CURSOR_TYPES.POINTER_2]: CursorPointerB,
      [CURSOR_TYPES.WAIT]: CursorWait,
      [CURSOR_TYPES.CROSSHAIR]: CursorCrosshair
    }[String(type)]();
  }

  setCurrent(type) {
    if (!type) {
      this.current.value = this.#default;
    } else {
      this.current.value = this.getCursor(type);
    }
  }
}

export default class Screen extends Module {
  static NAME = 'Screen';

  defaultTheme = ref(null);
  currentTheme = ref(null);

  cursor = new Cursor();

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
  };

  contentLayout = {
    size: ipoint(0, 0),
    position: ipoint(0, 0)
  };

  constructor(options) {
    const { core, contentEl } = Object.assign(
      { core: null, contentEl: null },
      options
    );
    super({ commands, core });

    this.#contentEl = contentEl;

    this.defaultTheme.value = this.currentTheme.value = this.getDefaultTheme();

    if (window === undefined) {
      throw new Error('ScreenControl is only for Browser');
    }
    domReady.then(this.onReady.bind(this)).catch(err => {
      throw err;
    });
  }

  destroy() {
    window.removeEventListener('resize', this.onResize.bind(this), false);
  }

  updateContentLayout(contentEl) {
    const { x, y, width, height } = contentEl.getBoundingClientRect();
    this.contentLayout = {
      size: ipoint(width, height),
      position: ipoint(x, y)
    };
  }

  updateScreenLayout(contentEl) {
    const { x, y, width, height } = contentEl.getBoundingClientRect();
    this.screenLayout = {
      size: ipoint(width, height),
      position: ipoint(x, y)
    };
  }

  getDefaultTheme() {
    const theme =
      this.core.config.get(CORE_CONFIG_NAMES.THEME) ||
      PALETTE_THEMES[String(DEFAULT_PALETTE_THEME)];
    return new PaletteTheme('current', theme);
  }

  setTheme(theme) {
    return (this.currentTheme.value = theme || this.getDefaultTheme());
  }

  // events

  onReady() {
    window.addEventListener('resize', this.onResize.bind(this), false);
    this.onResize();
  }

  onResize() {
    if (this.#contentEl) {
      const { x, y, width, height } = this.#contentEl.getBoundingClientRect();
      this.positions.content = ipoint(x, y);
      this.sizes.content = ipoint(width, height);
    }
  }
}

window.oncontextmenu = e => {
  e.preventDefault();
};
