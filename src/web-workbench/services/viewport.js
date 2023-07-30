
import { ipoint } from '@js-basics/vector';

import { ReplaySubject } from 'rxjs';
class Viewport {
  screenSize = ipoint(0, 0);
  #resize = new ReplaySubject(0);

  constructor () {
    window.addEventListener('resize', this.onResize.bind(this), false);
  }

  destroy () {
    window.removeEventListener('resize', this.onResize.bind(this), false);
  }

  onResize () {
    this.screenSize = ipoint(window.innerWidth, window.innerHeight);
  }

  getElementSize (el) {
    return ipoint(el.offsetWidth, el.offsetHeight);
  }

  get resize () {
    return this.#resize;
  }
}

let viewport;

export default viewport || (viewport = new Viewport());
