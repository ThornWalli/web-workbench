import type { Observable } from 'rxjs';
import { fromEvent, share, map } from 'rxjs';
import type { NormalizedPointerEvent } from './dom';
import { normalizePointerEvent } from './dom';
import type { HotKey } from '../classes/MenuItem/Interaction';
import { KEYBOARD_CODE } from '../types/dom';

type Elements = HTMLElement | Window | Document;

export class DomEvents {
  observers: Map<Elements, Map<string, Observable<Event>>> = new Map();
  capsLockActive = false;
  shiftLeftActive = false;
  shiftRightActive = false;
  metaLeftActive = false;
  metaRightActive = false;
  ctrlLeftActive = false;
  ctrlRightActive = false;
  altLeftActive = false;
  altRightActive = false;

  pointerActive = false;

  pointerDown: Observable<NormalizedPointerEvent>;
  pointerUp: Observable<NormalizedPointerEvent>;
  pointerMove: Observable<NormalizedPointerEvent>;
  pointerCancel: Observable<NormalizedPointerEvent>;
  keyDown: Observable<KeyboardEvent>;
  keyUp: Observable<KeyboardEvent>;
  keyPress: Observable<KeyboardEvent>;
  resize: Observable<Event>;

  constructor() {
    this.resize = this.get<Event>('resize', window).pipe(share());

    this.pointerDown = this.get<PointerEvent>('pointerdown')
      .pipe(map(e => normalizePointerEvent(e)))
      .pipe(share());
    this.pointerUp = this.get<PointerEvent>('pointerup')
      .pipe(map(e => normalizePointerEvent(e)))
      .pipe(share());
    this.pointerMove = this.get<PointerEvent>('pointermove')
      .pipe(map(e => normalizePointerEvent(e)))
      .pipe(share());
    this.pointerCancel = this.get<PointerEvent>('pointercancel').pipe(
      map(e => normalizePointerEvent(e)),
      share()
    );

    this.pointerDown?.subscribe(() => {
      this.pointerActive = true;
    });
    this.pointerUp?.subscribe(() => {
      this.pointerActive = false;
    });

    this.keyPress = this.get<KeyboardEvent>('keypress').pipe(share());
    this.keyDown = this.get<KeyboardEvent>('keydown', undefined, {
      passive: false,
      capture: true
    }).pipe(share());
    this.keyUp = this.get<KeyboardEvent>('keyup').pipe(share());
    this.keyDown?.subscribe(({ code }) => {
      switch (code) {
        case KEYBOARD_CODE.CONTROL_LEFT:
          this.ctrlLeftActive = true;
          break;
        case KEYBOARD_CODE.CONTROL_RIGHT:
          this.ctrlRightActive = true;
          break;
        case KEYBOARD_CODE.META_LEFT:
          this.metaLeftActive = true;
          break;
        case KEYBOARD_CODE.CONTEXT_MENU:
          this.metaRightActive = true;
          break;
        case KEYBOARD_CODE.SHIFT_LEFT:
          this.shiftLeftActive = true;
          break;
        case KEYBOARD_CODE.SHIFT_RIGHT:
          this.shiftRightActive = true;
          break;
        case KEYBOARD_CODE.ALT_LEFT:
          this.altLeftActive = true;
          break;
        case KEYBOARD_CODE.ALT_RIGHT:
          this.altRightActive = true;
          break;
        case KEYBOARD_CODE.CAPS_LOCK:
          this.capsLockActive = !this.capsLockActive;
          break;
      }
    });

    this.keyUp?.subscribe(({ code }) => {
      switch (code) {
        case KEYBOARD_CODE.CONTROL_LEFT:
          this.ctrlLeftActive = false;
          break;
        case KEYBOARD_CODE.CONTROL_RIGHT:
          this.ctrlRightActive = false;
          break;
        case KEYBOARD_CODE.META_LEFT:
          this.metaLeftActive = false;
          break;
        case KEYBOARD_CODE.CONTEXT_MENU:
          this.metaRightActive = false;
          break;
        case KEYBOARD_CODE.SHIFT_LEFT:
          this.shiftLeftActive = false;
          break;
        case KEYBOARD_CODE.SHIFT_RIGHT:
          this.shiftRightActive = false;
          break;
        case KEYBOARD_CODE.ALT_LEFT:
          this.altLeftActive = false;
          break;
        case KEYBOARD_CODE.ALT_RIGHT:
          this.altRightActive = false;
          break;
      }
    });
  }

  get<T>(
    eventName: string,
    el?: Elements,
    options: {
      passive?: boolean;
      capture?: boolean;
    } = { passive: true, capture: false }
  ) {
    el = el || document;
    if (!this.observers.has(el)) {
      this.observers.set(el, new Map());
    }
    const observer = this.observers.get(el) as Map<string, Observable<T>>;
    if (observer && !observer.has(eventName)) {
      observer.set(eventName, fromEvent<T>(el, eventName, options));
    }
    return observer.get(eventName) as Observable<T>;
  }

  reset() {
    this.observers.clear();
  }

  get metaActive() {
    return this.metaLeftActive || this.metaRightActive;
  }

  get ctrlActive() {
    return this.ctrlLeftActive || this.ctrlRightActive;
  }

  get altActive() {
    return this.altLeftActive || this.altRightActive;
  }

  get shiftActive() {
    return this.shiftLeftActive || this.shiftRightActive;
  }

  resolveHotKey(hotKey: HotKey, e: KeyboardEvent | string) {
    const code = typeof e === 'string' ? e : e.code;
    const key = typeof e === 'string' ? e : e.key;

    const target = {
      alt: hotKey.alt ?? false,
      caps: hotKey.caps ?? false,
      ctrl: hotKey.ctrl ?? false,
      meta: hotKey.meta ?? false,
      shift: hotKey.shift ?? false,
      code: hotKey.code,
      key: hotKey.key
    };

    const result = [
      this.altActive === target.alt, // alt
      this.capsLockActive === target.caps, // caps
      this.ctrlActive === target.ctrl, // ctrl
      this.metaActive === target.meta, // meta
      this.shiftActive === target.shift, // shift
      hotKey.code ? hotKey.code === code : true, // code
      hotKey.key ? hotKey.key === key : true // key
    ];

    return !result.includes(false);
  }
}

const domEvents = new DomEvents();
export default domEvents;
