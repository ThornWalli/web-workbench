import { ipoint } from '@js-basics/vector';
import Module from '../../Module';
import commands from './commands';
import { domReady } from '@/web-workbench/services/dom';

export default class Screen extends Module {
  static NAME = 'Screen';
  #contentEl;
  sizes = {
    content: ipoint(0, 0)
  };

  positions = {
    content: ipoint(0, 0)
  };

  contentLayout = {
    size: ipoint(0, 0),
    position: ipoint(0, 0)
  }

  updateContentLayout (contentEl) {
    const { x, y, width, height } = contentEl.getBoundingClientRect();

    this.contentLayout = {
      size: ipoint(width, height),
      position: ipoint(x, y)
    };
  }

  constructor (options) {
    const { core, contentEl } = Object.assign({ core: null, contentEl: null }, options);
    super({ commands, core });

    this.#contentEl = contentEl;

    if (window === undefined) {
      throw new Error('ScreenControl is only for Browser');
    }
    domReady.then(this.onReady.bind(this)).catch((err) => {
      throw err;
    });
  }

  onResize () {
    const { x, y, width, height } = this.#contentEl.getBoundingClientRect();
    this.positions.content = ipoint(x, y);
    this.sizes.content = ipoint(width, height);
  }

  destroy () {
    global.removeEventListener('resize', this.onResize.bind(this), false);
  }

  onReady () {
    global.addEventListener('resize', this.onResize.bind(this), false);
    this.onResize();
  }
}

// eslint-disable-next-line no-empty-function
global.oncontextmenu = (e) => {
  e.preventDefault();
};
