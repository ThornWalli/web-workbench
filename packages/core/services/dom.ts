import { ipoint } from '@js-basics/vector';

const DOUBLE_CLICK_DELAY = 500; // ms

export const KEYBOARD_KEY = {
  // Modifier Keys
  ENTER: 'Enter',
  CONTROL: 'Control',
  ALT: 'Alt',
  SHIFT: 'Shift',
  CAPS_LOCK: 'CapsLock',
  META: 'Meta', // Corresponds to the Windows key or Command key
  CONTEXT_MENU: 'ContextMenu',

  // Arrow Keys
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',

  // Numpad Keys (values like '0', '1', 'Enter' can be duplicates of other key types)
  NUM_PAD_0: '0',
  NUM_PAD_1: '1',
  NUM_PAD_2: '2',
  NUM_PAD_3: '3',
  NUM_PAD_4: '4',
  NUM_PAD_5: '5',
  NUM_PAD_6: '6',
  NUM_PAD_7: '7',
  NUM_PAD_8: '8',
  NUM_PAD_9: '9',
  NUM_PAD_ADD: '+',
  NUM_PAD_SUBTRACT: '-',
  NUM_PAD_MULTIPLY: '*',
  NUM_PAD_DIVIDE: '/',
  NUM_PAD_DECIMAL: '.',
  NUM_PAD_ENTER: 'Enter', // Duplicate value with ENTER

  // Function Keys
  FUNCTION_1: 'F1',
  FUNCTION_2: 'F2',
  FUNCTION_3: 'F3',
  FUNCTION_4: 'F4',
  FUNCTION_5: 'F5',
  FUNCTION_6: 'F6',
  FUNCTION_7: 'F7',
  FUNCTION_8: 'F8',
  FUNCTION_9: 'F9',
  FUNCTION_10: 'F10',
  FUNCTION_11: 'F11',
  FUNCTION_12: 'F12',

  // Alphabet Keys (typically lowercase for 'key' property unless Shift is pressed)
  KEY_A: 'a',
  KEY_B: 'b',
  KEY_C: 'c',
  KEY_D: 'd',
  KEY_E: 'e',
  KEY_F: 'f',
  KEY_G: 'g',
  KEY_H: 'h',
  KEY_I: 'i',
  KEY_J: 'j',
  KEY_K: 'k',
  KEY_L: 'l',
  KEY_M: 'm',
  KEY_N: 'n',
  KEY_O: 'o',
  KEY_P: 'p',
  KEY_Q: 'q',
  KEY_R: 'r',
  KEY_S: 's',
  KEY_T: 't',
  KEY_U: 'u',
  KEY_V: 'v',
  KEY_W: 'w',
  KEY_X: 'x',
  KEY_Y: 'y',
  KEY_Z: 'z',

  // Number Keys (top row)
  DIGIT_0: '0', // Duplicate value with NUM_PAD_0
  DIGIT_1: '1', // Duplicate value with NUM_PAD_1
  DIGIT_2: '2',
  DIGIT_3: '3',
  DIGIT_4: '4',
  DIGIT_5: '5',
  DIGIT_6: '6',
  DIGIT_7: '7',
  DIGIT_8: '8',
  DIGIT_9: '9',

  // Special Keys
  SPACE: ' ',
  TAB: 'Tab',
  BACKSPACE: 'Backspace',
  DELETE: 'Delete',
  INSERT: 'Insert',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
  ESCAPE: 'Escape',
  PRINT_SCREEN: 'PrintScreen',
  SCROLL_LOCK: 'ScrollLock',
  PAUSE: 'Pause',
  NUM_LOCK: 'NumLock',

  // Punctuation and Symbol Keys (common ones, may vary by layout)
  SEMICOLON: ';',
  EQUAL: '=',
  COMMA: ',',
  MINUS: '-',
  PERIOD: '.',
  SLASH: '/',
  BACKQUOTE: '`',
  BRACKET_LEFT: '[',
  BACKSLASH: '\\',
  BRACKET_RIGHT: ']',
  QUOTE: "'",

  // Media Keys (common ones)
  MEDIA_PLAY_PAUSE: 'MediaPlayPause',
  MEDIA_STOP: 'MediaStop',
  MEDIA_NEXT_TRACK: 'MediaTrackNext',
  MEDIA_PREVIOUS_TRACK: 'MediaTrackPrevious',
  VOLUME_UP: 'VolumeUp',
  VOLUME_DOWN: 'VolumeDown',
  VOLUME_MUTE: 'VolumeMute'
} as const;

// export enum KEYBOARD_CODE {
//   ENTER = 'Enter',
//   CONTROL_LEFT = 'ControlLeft',
//   CONTROL_RIGHT = 'ControlRight',
//   ALT_LEFT = 'AltLeft',
//   ALT_RIGHT = 'AltRight',
//   SHIFT_LEFT = 'ShiftLeft',
//   SHIFT_RIGHT = 'ShiftRight',
//   CAPS_LOCK = 'CapsLock',
//   ARROW_UP = 'ArrowUp',
//   ARROW_DOWN = 'ArrowDown',
//   ARROW_LEFT = 'ArrowLeft',
//   ARROW_RIGHT = 'ArrowRight',
//   NUM_PAD_1 = 'Numpad1',
//   NUM_PAD_2 = 'Numpad2',
//   NUM_PAD_3 = 'Numpad3',
//   NUM_PAD_4 = 'Numpad4',
//   NUM_PAD_5 = 'Numpad5',
//   NUM_PAD_6 = 'Numpad6',
//   NUM_PAD_7 = 'Numpad7',
//   NUM_PAD_8 = 'Numpad8',
//   NUM_PAD_9 = 'Numpad9',
//   KEY_F = 'keyF',
//   KEY_S = 'KeyS',
//   KEY_X = 'KeyX',
//   FUNCTION_9 = 'F9',
//   INSERT = 'Numpad0',
//   META_LEFT = 'MetaLeft',
//   META_RIGHT = 'MetaRight',
//   CONTEXT_MENU = 'ContextMenu'
// }
// export enum KEYBOARD_KEY {
//   ENTER = 'Enter',
//   CONTROL = 'Control',
//   ALT = 'Alt',
//   SHIFT = 'Shift',
//   CAPS_LOCK = 'CapsLock',
//   ARROW_UP = 'ArrowUp',
//   ARROW_DOWN = 'ArrowDown',
//   ARROW_LEFT = 'ArrowLeft',
//   ARROW_RIGHT = 'ArrowRight',
//   NUM_PAD_1 = '1',
//   NUM_PAD_2 = '2',
//   NUM_PAD_3 = '3',
//   NUM_PAD_4 = '4',
//   NUM_PAD_5 = '5',
//   NUM_PAD_6 = '6',
//   NUM_PAD_7 = '7',
//   NUM_PAD_8 = '8',
//   NUM_PAD_9 = '9',
//   KEY_F = 'F',
//   KEY_X = 'X',
//   FUNCTION_9 = 'F9',
//   EXECUTE = 'Execute',
//   INSERT = 'Insert'
// }
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
 * @deprecated use native closest or for elmeent use findClosestElement.
 */
export function closestEl(el: Element | EventTarget, target: Element) {
  if (el === target) {
    return true;
  }
  if (el instanceof Element && el.parentElement) {
    if (el.parentElement !== target) {
      return closestEl(el.parentElement, target);
    } else {
      return true;
    }
  }
  return false;
}

export function findClosestEl(
  startElement: Element | null,
  targetElement: Element | null
): Element | null {
  if (!startElement || !targetElement) {
    return null;
  }

  let currentElement: Element | null = startElement;
  while (currentElement) {
    if (currentElement === targetElement) {
      return currentElement;
    }
    currentElement = currentElement.parentElement;
  }

  return null;
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
  event: PointerEvent | MouseEvent | NormalizedPointerEvent | Event
) {
  let x = 0;
  let y = 0;
  if (
    'touches' in event &&
    Array.isArray(event.touches) &&
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

export function isWindows() {
  return window.navigator.userAgent.indexOf('Win') > -1;
}
