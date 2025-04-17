const DOUBLE_CLICK_DELAY = 500; // ms

let scrollbarWidth = 0;
export function getScrollbarWidth() {
  return scrollbarWidth;
}

export const domReady = new Promise(resolve => {
  if (/complete|interactive|loaded/.test(document.readyState)) {
    resolve(true);
  } else {
    document.addEventListener('DOMContentLoaded', resolve, false);
  }
});

class ScrollBar {
  size?: number;

  constructor() {
    window.requestAnimationFrame(() => {
      document.documentElement.style.overflowY = 'scroll';
      this.size = window.innerWidth - document.body.offsetWidth;
      document.documentElement.style.overflowY = '';
    });
  }
}
const scrollBar = new ScrollBar();
export default scrollBar;

export function closestEl(el: HTMLElement, target: HTMLElement) {
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
  document.documentElement.style.overflowY = '';
});

export function normalizePointerEvent(
  event: PointerEvent | MouseEvent | TouchEvent
) {
  let x = 0;
  let y = 0;
  if (
    event instanceof TouchEvent &&
    event.touches &&
    event.touches.length > 0
  ) {
    const touch = event.touches[0];
    x = touch.clientX;
    y = touch.clientY;
  } else if (event instanceof MouseEvent || event instanceof PointerEvent) {
    x = event.x;
    y = event.y;
  }
  return { ...event, x, y } as PointerEvent;
}

let doubleTabIndicator: number;
export function doubleTab() {
  if (!doubleTabIndicator) {
    doubleTabIndicator = Date.now();
  } else {
    if (Date.now() - doubleTabIndicator < DOUBLE_CLICK_DELAY) {
      doubleTabIndicator = -1;
      return true;
    }
    doubleTabIndicator = -1;
  }
  return false;
}

export function hasTouchevents() {
  return isTouchDevice();
}

function isTouchDevice() {
  const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  const mq = function (query: string) {
    return window.matchMedia(query).matches;
  };

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join(
    ''
  );
  return mq(query);
}
