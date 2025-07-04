import { ipoint } from '@js-basics/vector';
import Module, { type ModuleConstructorOptions } from '../../classes/Module';
import type Theme from '../../classes/Theme';
import {
  PaletteTheme,
  PALETTE_THEMES,
  DEFAULT_PALETTE_THEME,
  type PaletteThemeDescription
} from '../../classes/Theme';
import { CONFIG_NAMES as CORE_CONFIG_NAMES } from '../../classes/Core/types';

import { domReady } from '../../services/dom';
import commands from './commands';
import './types';
import CursorWrapper from '../../classes/CursorWrapper';

export default class Screen extends Module {
  static NAME = 'Screen';

  defaultTheme?: Theme;
  currentTheme?: Theme;

  cursor = new CursorWrapper();

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

  constructor(options: ModuleConstructorOptions) {
    const {
      core,
      contentEl
    }: ModuleConstructorOptions & {
      contentEl?: HTMLElement | null;
    } = {
      contentEl: undefined,
      ...options
    };
    super({ name: 'Screen', commands, core });

    this.contentEl = contentEl;

    this.defaultTheme = this.currentTheme = this.getDefaultTheme();

    if (window === undefined) {
      throw new Error('ScreenControl is only for Browser');
    }
    domReady.then(this.onReady.bind(this)).catch(err => {
      throw err;
    });

    if (core.executionCounter > 0) {
      this.cursor.setWait(true);
    }
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
    return (this.currentTheme = theme || this.getDefaultTheme());
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
