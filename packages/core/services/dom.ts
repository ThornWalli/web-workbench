import { ipoint } from '@js-basics/vector';

const DOUBLE_CLICK_DELAY = 500; // ms

export enum KEYBOARD_CODE {
  ENTER = 'Enter',
  CONTROL_LEFT = 'ControlLeft',
  CONTROL_RIGHT = 'ControlRight',
  ALT_LEFT = 'AltLeft',
  ALT_RIGHT = 'AltRight',
  SHIFT_LEFT = 'ShiftLeft',
  SHIFT_RIGHT = 'ShiftRight',
  CAPS_LOCK = 'CapsLock',
  ARROW_UP = 'ArrowUp',
  ARROW_DOWN = 'ArrowDown',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
  NUM_PAD_1 = 'Numpad1',
  NUM_PAD_2 = 'Numpad2',
  NUM_PAD_3 = 'Numpad3',
  NUM_PAD_4 = 'Numpad4',
  NUM_PAD_5 = 'Numpad5',
  NUM_PAD_6 = 'Numpad6',
  NUM_PAD_7 = 'Numpad7',
  NUM_PAD_8 = 'Numpad8',
  NUM_PAD_9 = 'Numpad9',
  KEY_F = 'keyF',
  KEY_X = 'KeyX',
  FUNCTION_9 = 'F9',
  INSERT = 'Numpad0'
}
export enum KEYBOARD_KEY {
  ENTER = 'Enter',
  CONTROL = 'Control',
  ALT = 'Alt',
  SHIFT = 'Shift',
  CAPS_LOCK = 'CapsLock',
  ARROW_UP = 'ArrowUp',
  ARROW_DOWN = 'ArrowDown',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
  NUM_PAD_1 = '1',
  NUM_PAD_2 = '2',
  NUM_PAD_3 = '3',
  NUM_PAD_4 = '4',
  NUM_PAD_5 = '5',
  NUM_PAD_6 = '6',
  NUM_PAD_7 = '7',
  NUM_PAD_8 = '8',
  NUM_PAD_9 = '9',
  KEY_F = 'F',
  KEY_X = 'X',
  FUNCTION_9 = 'F9',
  EXECUTE = 'Execute',
  INSERT = 'Insert'
}
export enum MOUSE_BUTTON {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
  BACK = 3,
  FORWARD = 4
}
// Escape = 'Escape',
// ArrowUp = 'ArrowUp',
// ArrowDown = 'ArrowDown',
// ArrowLeft = 'ArrowLeft',
// ArrowRight = 'ArrowRight',
// Space = 'Space',
// KeyA = 'KeyA',
// KeyB = 'KeyB',
// KeyC = 'KeyC',
// Digit0 = 'Digit0',
// Digit1 = 'Digit1'

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
  size: number = 0;

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

/**
 * @deprecated use native closest
 */
export function closestEl(el: HTMLElement | EventTarget, target: HTMLElement) {
  if (el === target) {
    return true;
  }
  if (el instanceof HTMLElement && el.parentElement) {
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

export class NormalizedPointerEvent {
  x: number;
  y: number;
  target: EventTarget | null;
  preventDefault: () => void;
  stopPropagation: () => void;
  constructor({
    x,
    y,
    target = null,
    preventDefault,
    stopPropagation
  }: {
    x: number;
    y: number;
    target: EventTarget | null;
    preventDefault: () => void;
    stopPropagation: () => void;
  }) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.preventDefault = preventDefault;
    this.stopPropagation = stopPropagation;
  }

  /**
   * @deprecated
   */
  get clientX() {
    console.warn('clientX is deprecated, use x instead');
    return this.x;
  }
  /**
   * @deprecated
   */
  get clientY() {
    console.warn('clientY is deprecated, use y instead');
    return this.y;
  }
}
export function normalizePointerEvent(
  event: PointerEvent | MouseEvent | TouchEvent | NormalizedPointerEvent
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
  } else if (
    event instanceof NormalizedPointerEvent ||
    event instanceof MouseEvent ||
    event instanceof PointerEvent
  ) {
    x = event.x;
    y = event.y;
  }
  return new NormalizedPointerEvent({
    x,
    y,
    target: event.target,
    preventDefault: event.preventDefault.bind(event),
    stopPropagation: event.stopPropagation.bind(event)
  });
}

export function getNormalizedPointerByRect(
  e: PointerEvent | NormalizedPointerEvent,
  boundingClientRect: DOMRect
) {
  const { x, y, width, height } = boundingClientRect;
  const elemPos = ipoint(x, y);
  const elemHalfSize = ipoint(() => ipoint(width, height) / 2);
  const touchPos = ipoint(e.x, e.y);
  return ipoint(() => (touchPos - elemPos - elemHalfSize) / elemHalfSize);
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
