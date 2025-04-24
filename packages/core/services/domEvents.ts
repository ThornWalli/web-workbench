import type { Observable } from 'rxjs';
import { fromEvent, share, map } from 'rxjs';
import type { NormalizedPointerEvent } from './dom';
import { normalizePointerEvent } from './dom';

type Elements = HTMLElement | Window | Document;

class DomEvents {
  observers: Map<Elements, Map<string, Observable<Event>>> = new Map();
  capsLockActive = false;
  shiftLeftActive = false;
  shiftRightActive = false;
  cmdLeftActive = false;
  cmdRightActive = false;
  altLeftActive = false;
  altRightActive = false;
  pointerDown: Observable<NormalizedPointerEvent>;
  pointerUp: Observable<NormalizedPointerEvent>;
  pointerMove: Observable<NormalizedPointerEvent>;
  keyDown: Observable<KeyboardEvent>;
  keyUp: Observable<KeyboardEvent>;
  keyPress: Observable<KeyboardEvent>;
  resize: Observable<Event>;

  /**
   * @deprecated
   */
  getPointerDown(el?: HTMLElement) {
    return this.get<PointerEvent>('pointerdown', el)
      .pipe(map(e => normalizePointerEvent(e)))
      .pipe(share());
  }

  /**
   * @deprecated
   */
  getPointerUp(el?: HTMLElement) {
    return this.get<PointerEvent>('pointerup', el)
      .pipe(map(e => normalizePointerEvent(e)))
      .pipe(share());
  }

  /**
   * @deprecated
   */
  getPointerMove(el?: HTMLElement) {
    return this.get<PointerEvent>('pointermove', el)
      .pipe(map(e => normalizePointerEvent(e)))
      .pipe(share());
  }

  constructor() {
    this.resize = this.get<Event>('resize', window).pipe(share());

    this.pointerDown = this.getPointerDown();
    this.pointerUp = this.getPointerUp();
    this.pointerMove = this.getPointerMove();

    this.keyPress = this.get<KeyboardEvent>('kexypress').pipe(share());
    this.keyDown = this.get<KeyboardEvent>('keydown').pipe(share());
    this.keyUp = this.get<KeyboardEvent>('keyup').pipe(share());
    this.keyDown?.subscribe(({ code, location }) => {
      switch (Number(code)) {
        case 91:
          this.cmdLeftActive = true;
          break;
        case 93:
          this.cmdRightActive = true;
          break;
        case 16:
          if (location === 2) {
            this.shiftRightActive = true;
          } else {
            this.shiftLeftActive = true;
          }
          break;
        case 18:
          if (location === 2) {
            this.altRightActive = true;
          } else {
            this.altLeftActive = true;
          }
          break;
        case 20:
          this.capsLockActive = !this.capsLockActive;
          break;
      }
    });

    this.keyUp?.subscribe(({ code, location }) => {
      switch (Number(code)) {
        case 91:
          this.cmdLeftActive = false;
          break;
        case 93:
          this.cmdRightActive = false;
          break;
        case 16:
          if (location === 2) {
            this.shiftRightActive = false;
          } else {
            this.shiftLeftActive = false;
          }
          break;
        case 18:
          if (location === 2) {
            this.altRightActive = false;
          } else {
            this.altLeftActive = false;
          }
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

  // get capsLockActive () {
  //   return this.capsLockActive;
  // }

  get cmdActive() {
    return this.cmdLeftActive || this.cmdRightActive;
  }

  get altActive() {
    return this.altLeftActive || this.altRightActive;
  }

  // get altLeftActive () {
  //   return this.altLeftActive;
  // }

  // get altRightActive () {
  //   return this.altRightActive;
  // }

  get shiftActive() {
    return this.shiftLeftActive || this.shiftRightActive;
  }

  // get shiftLeftActive () {
  //   return this.shiftLeftActive;
  // }

  // get shiftRightActive () {
  //   return this.shiftRightActive;
  // }
}

const domEvents = new DomEvents();
export default domEvents;
