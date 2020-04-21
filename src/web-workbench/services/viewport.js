
import { ipoint } from '@js-basics/vector';

class Viewport {
  screenSize = ipoint(0, 0);

  constructor () {
    global.addEventListener('resize', this.onResize.bind(this), false);
  }

  destroy () {
    global.removeEventListener('resize', this.onResize.bind(this), false);
  }

  onResize () {
    this.screenSize = ipoint(window.innerWidth, window.innerHeight);
  }

  getElementSize (el) {
    return ipoint(el.offsetWidth, el.offsetHeight);
  }
}

let viewport;

export default viewport || (viewport = new Viewport());
