const DOUBLE_CLICK_DELAY = 500; // ms

let scrollbarWidth = 0;
export function getScrollbarWidth() {
  return scrollbarWidth;
}

export const domReady = new Promise(resolve => {
  if (/complete|interactive|loaded/.test(document.readyState)) {
    resolve();
  } else {
    document.addEventListener('DOMContentLoaded', resolve, false);
  }
});

class ScrollBar {
  #size;

  constructor() {
    window.requestAnimationFrame(() => {
      document.documentElement.style.overflowY = 'scroll';
      this.#size = window.innerWidth - document.body.offsetWidth;
      document.documentElement.style.overflowY = null;
    });
  }

  get size() {
    return this.#size;
  }
}
const scrollBar = new ScrollBar();
export default scrollBar;

export function closestEl(el, target) {
  if (el === target) {
    return true;
  }
  if (el.parentElement) {
    if (el.parentElement !== target) {
      return closestEl(el.parentElement, target);
    } else {
      return true;
    }
  }
  return false;
}

window.requestAnimationFrame(() => {
  document.documentElement.style.overflowY = 'scroll';
  scrollbarWidth = window.innerWidth - document.body.offsetWidth;
  document.documentElement.style.overflowY = null;
});

export function touchEvent(event) {
  if (event.touches && event.touches.length > 0) {
    const touch = event.touches[0];
    event.clientX = touch.clientX;
    event.clientY = touch.clientY;
  }
  if (!('x' in event)) {
    event.x = event.clientX;
    event.y = event.clientY;
  }
  return event;
}

let doubleTabIndicator;
// const isTouch = isTouchDevice();

export function doubleTab() {
  if (!doubleTabIndicator) {
    doubleTabIndicator = Date.now();
  } else {
    if (Date.now() - doubleTabIndicator < DOUBLE_CLICK_DELAY) {
      doubleTabIndicator = null;
      return true;
    }
    doubleTabIndicator = null;
  }
  return false;
}

export function hasTouchevents() {
  return isTouchDevice();
}

function isTouchDevice() {
  const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  const mq = function (query) {
    return window.matchMedia(query).matches;
  };

  if (
    'ontouchstart' in window ||
    // eslint-disable-next-line no-undef
    (window.DocumentTouch && document instanceof DocumentTouch)
  ) {
    return true;
  }

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join(
    ''
  );
  return mq(query);
}
