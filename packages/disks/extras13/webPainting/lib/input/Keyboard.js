import { throttleTime } from 'rxjs';
import { clamp } from '@web-workbench/core/utils/math';
import domEvents from '@web-workbench/core/services/domEvents';
import Vector from '../Vector';

export default class Keyboard {
  subscriptions = [];

  constructor (app) {
    this._app = app;
  }

  register () {
    this.subscriptions.push(
      domEvents.keydown.pipe(throttleTime(200)).subscribe(onKeyDown.bind(this)),
      domEvents.keyup.subscribe(onKeyUp.bind(this))
    );
  }

  unregister () {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  registerDisplay (display) {
    // emtpy
  }

  unregisterDisplay (display) {
  // empty
  }
}

function onKeyUp (e) {
  switch (e.keyCode) {
    case 17: // strg
      e.preventDefault();
      this.holdCrtl = false;
      break;
    case 18: // alt
      e.preventDefault();
      this.holdAlt = false;
      break;
  }
}

// eslint-disable-next-line complexity
function onKeyDown (e) {
  if (this._app.display) {
    let value = 1;
    if (this.holdAlt) {
      value *= 10;
    }
    switch (e.keyCode) {
      case 17: // strg
        e.preventDefault();
        this.holdCrtl = true;
        break;
      case 18: // alt
        e.preventDefault();
        this.holdAlt = true;
        break;

      case 37: // left
        e.preventDefault();
        this._app.display.offset.x -= value;
        break;

      case 38: // up
        e.preventDefault();
        this._app.display.offset.y -= value;
        break;

      case 39: // right
        e.preventDefault();
        this._app.display.offset.x += value;
        break;

      case 40: // down
        e.preventDefault();
        this._app.display.offset.y += value;
        break;
    }

    const display = this._app.display;
    this._app.display.offset = new Vector(
      clamp(
        display.offset.x,
        -display.zoomBounds.min.x,
        display.canvasLayout.naturalSize.x - display.zoomBounds.max.x
      ),
      clamp(
        display.offset.y,
        -display.zoomBounds.min.y,
        display.canvasLayout.naturalSize.y - display.zoomBounds.max.y
      )
    );
    this._app.display.renderImageData();
  }
}
