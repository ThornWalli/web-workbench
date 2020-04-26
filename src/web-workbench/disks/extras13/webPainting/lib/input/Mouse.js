import { ipoint } from '@js-basics/vector';
import { clamp } from '@/web-workbench/utils/math';
import domEvents from '@/web-workbench/services/domEvents';

const POINTER_HOLD_INTERVAL = 20;

export default class Mouse {
  subscribtions = [];
  displaySubscribtions = new Map();
  runSubscribtions = [];

  constructor (app) {
    this._app = app;
    this._pressed = false;
  }

  registerDisplay (display) {
    this.displaySubscribtions.set(display, [
      domEvents.get('mousemove', display.canvas).subscribe(this.onCursorMove(display).bind(this)),
      domEvents.get('mousedown', display.canvas).subscribe(this.onPointerDown(display).bind(this)),
      domEvents.get('mouseenter', display.canvas).subscribe(this.onPointerEnter(display).bind(this))
    ]);
  }

  unregisterDisplay (display) {
    if (this.displaySubscribtions.has(display)) {
      this.displaySubscribtions.get(display).forEach(subscription => subscription.unsubscribe());
      this.displaySubscribtions.delete(display);
    }
  }

  register () {}
  unregister () {}

  onCursorMove (display) {
    return (e) => {
      if (display && this.app.display === display) {
        this.app.display.setCursorEvent(getPointerEvent.bind(this)(e, display));
        // this.runActionResult(cursorMove.bind(this)(e, display));
      }
    };
  }

  // ####

  onContextMenu (display) {
    return (e) => {
      this.runActionResult(contextMenu.bind(this)(e, display));
    };
  }

  onPointerEnter (display) {
    return (e) => {
      this.app.setDisplay(display);
      const subscribtion = domEvents.get('mouseleave', e.target).subscribe((e) => {
        subscribtion.unsubscribe();
        this.onPointerLeave(display)(e);
      });
    };
  }

  onPointerLeave (display) {
    return (e) => {
      // empty
    };
  }

  onPointerDown (display) {
    return (e) => {
      this.app.setDisplay(display);
      this._pointerEvent = getPointerEvent.bind(this)(e, display);
      this._pressed = true;
      this.runActionResult(pointerDown.bind(this)(e, display), e, display);
    };
  }

  onPointerLeaveAndUp (display) {
    return (e) => {
      stopPointerDownHold();
      this.runActionResult(pointerLeaveAndUp.bind(this)(e, display));
    };
  }

  onPointerMove (display) {
    return (e) => {
      this.runActionResult(pointerMove.bind(this)(e, display));
    };
  }

  get app () {
    return this._app;
  }

  get pressed () {
    return this._pressed;
  }

  runActionResult (result, e, display) {
    if (result) {
      if (result.events) {
        this.runSubscribtions = [
          domEvents.get('contextmenu', e.target).subscribe(this.onContextMenu(display).bind(this)),
          domEvents.get('mouseleave', e.target).subscribe(this.onPointerLeaveAndUp(display).bind(this)),
          domEvents.get('mousemove', e.target).subscribe(this.onPointerMove(display).bind(this)),
          domEvents.get('mouseup', e.target).subscribe(this.onPointerLeaveAndUp(display).bind(this))
        ];
      }
      if (result.save) {
        this.app.canvas.saveStack();
      }
      if (result.revert) {
        this.app.canvas.revertStack();
      }
      if (result.render) {
        this.app.canvas.render();
      }
    }
  }

  unsubscribeRun () {
    this.runSubscribtions.forEach(subscription => subscription.unsubscribe());
    this.runSubscribtions = [];
  }
}

let pointerHoldInterval;

function stopPointerDownHold () {
  global.clearInterval(pointerHoldInterval);
  pointerHoldInterval = null;
}

function pointerHoldLoop (cb) {
  stopPointerDownHold();
  pointerHoldInterval = global.setInterval(cb, POINTER_HOLD_INTERVAL);
}

function getPointerEvent (e, display) {
  let position = ipoint(e.clientX - display.bounds.min.x, e.clientY - display.bounds.min.y);

  const displaySize = ipoint(display.width, display.height);

  position = ipoint(() => position - ((display.bounds.max - display.bounds.min) / displaySize / this.app.brush.data.length));

  if (this.app.globalBounds) {
    position = ipoint(() => position - this.app.globalBounds.min);
  }

  const origin = ipoint(() => clamp(Math.floor(position), 0, display.naturalSize));

  if (display.zoomFactor > 0) {
    position = ipoint(() => display.zoomBounds.min + (position / display.canvasSize) * displaySize);
  }

  position = ipoint(() => clamp(Math.floor(position + display.offset), 0, display.naturalSize));

  return {
    position,
    origin,
    app: this.app,
    x: position.x,
    y: position.y,
    originX: origin.x,
    originY: origin.y,
    leftClick: e.button !== 2,
    rightClick: e.button === 2,
    holdAlt: domEvents.altActive,
    holdCtrl: domEvents.cmdActive
  };
}

function pointerDown () {
  const result = {
    events: true
  };
  if (this.app.tool.pointerDownHold) {
    pointerHoldLoop(() => {
      this.runActionResult(this.app.tool.onPointerDown(this._pointerEvent, this));
      this.app.canvas.render();
    });
  } else {
    return Object.assign(result, this.app.tool.onPointerDown(this._pointerEvent, this));
  }
  return result;
}

function pointerLeaveAndUp (e, display) {
  this._pressed = false;
  this._pointerEvent = null;
  this.unsubscribeRun();
  return this.app.tool.onPointerUp(getPointerEvent.bind(this)(e, display), this);
}

function pointerMove (e, display) {
  this._pointerEvent = getPointerEvent.bind(this)(e, display);
  return this.app.tool.onPointerMove(this._pointerEvent, this);
}

function contextMenu (e, display) {
  e.preventDefault();
  e.stopPropagation();
  return this.app.tool.onContextMenu(getPointerEvent.bind(this)(e, display), this);
}
