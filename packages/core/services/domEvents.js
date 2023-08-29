import { fromEvent, map, shareReplay } from 'rxjs';
import { touchEvent } from './dom';

class DomEvents {
  #observers = new Map();
  capsLockActive = false;
  shiftLeftActive = false;
  shiftRightActive = false;
  cmdLeftActive = false;
  cmdRightActive = false;
  altLeftActive = false;
  altRightActive = false;
  pointerDown = null;
  pointerUp = null;
  pointerMove = null;
  keyDown = null;
  keyUp = null;

  getPointerDown(el) {
    return this.get('pointerdown', el)
      .pipe(map(e => touchEvent(e)))
      .pipe(shareReplay(1));
  }

  getPointerUp(el) {
    return this.get('pointerup', el)
      .pipe(map(e => touchEvent(e)))
      .pipe(shareReplay(1));
  }

  getPointerMove(el) {
    return this.get('pointermove', el)
      .pipe(map(e => touchEvent(e)))
      .pipe(shareReplay(1));
  }

  constructor() {
    this.resize = this.get('resize', window).pipe(shareReplay(1));

    this.pointerDown = this.getPointerDown();

    this.pointerUp = this.getPointerUp();

    this.pointerMove = this.getPointerMove();

    this.keypress = this.get('keypress').pipe(shareReplay(1));
    this.keydown = this.keyDown = this.get('keydown').pipe(shareReplay(1));
    this.keyup = this.keyUp = this.get('keyup').pipe(shareReplay(1));
    this.keyDown.subscribe(({ keyCode, location }) => {
      switch (keyCode) {
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

    this.keyUp.subscribe(({ keyCode, location }) => {
      switch (keyCode) {
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

  get(eventName, el) {
    el = el || document;
    if (!this.#observers.has(el)) {
      this.#observers.set(el, new Map());
    }
    const observer = this.#observers.get(el);
    if (!observer.has(eventName)) {
      const options = { passive: true, capture: false };
      observer.set(eventName, fromEvent(el, eventName, options));
    }
    return observer.get(eventName);
  }

  reset() {
    Array.from(this.#observers.values).forEach(observer =>
      observer.unsubscribe()
    );
    this.#observers.reset();
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

let domEvents;

export default domEvents || (domEvents = new DomEvents());
