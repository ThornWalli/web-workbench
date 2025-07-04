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
  cmdLeftActive = false;
  cmdRightActive = false;
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
    this.keyDown = this.get<KeyboardEvent>('keydown').pipe(share());
    this.keyUp = this.get<KeyboardEvent>('keyup').pipe(share());
    this.keyDown?.subscribe(({ code }) => {
      switch (code) {
        case KEYBOARD_CODE.META_LEFT:
          this.cmdLeftActive = true;
          break;
        case KEYBOARD_CODE.CONTEXT_MENU:
          this.cmdRightActive = true;
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
        case KEYBOARD_CODE.META_LEFT:
          this.cmdLeftActive = false;
          break;
        case KEYBOARD_CODE.CONTEXT_MENU:
          this.cmdRightActive = false;
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

  get<T>(eventName: string, el?: Elements) {
    el = el || document;
    if (!this.observers.has(el)) {
      this.observers.set(el, new Map());
    }
    const observer = this.observers.get(el) as Map<string, Observable<T>>;
    if (observer && !observer.has(eventName)) {
      const options = { passive: true, capture: false };
      observer.set(eventName, fromEvent<T>(el, eventName, options));
    }
    return observer.get(eventName) as Observable<T>;
  }

  reset() {
    this.observers.clear();
  }

  get cmdActive() {
    return this.cmdLeftActive || this.cmdRightActive;
  }

  get altActive() {
    return this.altLeftActive || this.altRightActive;
  }

  get shiftActive() {
    return this.shiftLeftActive || this.shiftRightActive;
  }

  resolveHotKey(hotKey: HotKey, e: KeyboardEvent | string) {
    const code = typeof e === 'string' ? e : e.code;
    const values = [
      hotKey.shift ? this.shiftActive : true,
      hotKey.alt ? this.altActive : true,
      hotKey.cmd ? this.cmdActive : true,
      hotKey.caps ? this.capsLockActive : true,
      hotKey.code ? hotKey?.code === code : true
    ];
    return !values.includes(false);
  }
}

const domEvents = new DomEvents();
export default domEvents;
