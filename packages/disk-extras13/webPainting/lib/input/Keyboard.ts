import { Subscription, throttleTime } from 'rxjs';
import { clamp } from '@web-workbench/core/utils/math';
import domEvents from '@web-workbench/core/services/domEvents';
import type App from '../App';
import type Display from '../Display';
import { KEYBOARD_KEY } from '@web-workbench/core/services/dom';
import { ipoint } from '@js-basics/vector';

export default class Keyboard {
  app: App;
  subscription = new Subscription();

  holdCrtl = false;
  holdAlt = false;

  constructor(app: App) {
    this.app = app;
  }

  register() {
    this.subscription.add(
      domEvents.keyDown.pipe(throttleTime(200)).subscribe(this.onKeyDown)
    );
    this.subscription.add(
      this.subscription.add(domEvents.keyUp.subscribe(this.onKeyUp))
    );
  }

  unregister() {
    this.subscription.unsubscribe();
  }
  registerDisplay(display: Display) {
    console.warn('registerDisplay not implemented', display);
  }

  unregisterDisplay(display: Display) {
    console.warn('unregisterDisplay not implemented', display);
  }

  onKeyUp(e: KeyboardEvent) {
    switch (e.key) {
      case KEYBOARD_KEY.CONTROL: // strg
        e.preventDefault();
        this.holdCrtl = false;
        break;
      case KEYBOARD_KEY.ALT: // alt
        e.preventDefault();
        this.holdAlt = false;
        break;
    }
  }

  onKeyDown(e: KeyboardEvent) {
    if (this.app.display) {
      let value = 1;
      if (this.holdAlt) {
        value *= 10;
      }
      switch (e.key) {
        case KEYBOARD_KEY.CONTROL: // strg
          e.preventDefault();
          this.holdCrtl = true;
          break;
        case KEYBOARD_KEY.ALT: // alt
          e.preventDefault();
          this.holdAlt = true;
          break;

        case KEYBOARD_KEY.ARROW_LEFT: // left
          e.preventDefault();
          this.app.display.offset.x -= value;
          break;

        case KEYBOARD_KEY.ARROW_UP: // up
          e.preventDefault();
          this.app.display.offset.y -= value;
          break;

        case KEYBOARD_KEY.ARROW_RIGHT: // right
          e.preventDefault();
          this.app.display.offset.x += value;
          break;

        case KEYBOARD_KEY.ARROW_DOWN: // down
          e.preventDefault();
          this.app.display.offset.y += value;
          break;
      }

      const display = this.app.display;
      this.app.display.offset = ipoint(() => {
        return clamp(
          display.offset,
          -display.zoomBounds.min,
          display.canvasLayout.naturalSize - display.zoomBounds.max
        );
      });
      // this.app.display.offset = ipoint(
      //   clamp(
      //     display.offset.x,
      //     -display.zoomBounds.min.x,
      //     display.canvasLayout.naturalSize.x - display.zoomBounds.max.x
      //   ),
      //   clamp(
      //     display.offset.y,
      //     -display.zoomBounds.min.y,
      //     display.canvasLayout.naturalSize.y - display.zoomBounds.max.y
      //   )
      // );
      this.app.display.renderImageData();
    }
  }
}
