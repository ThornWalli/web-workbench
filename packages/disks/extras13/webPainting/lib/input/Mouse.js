import { ipoint } from '@js-basics/vector';
import domEvents from '@web-workbench/core/services/domEvents';

const POINTER_HOLD_INTERVAL = 20;

export default class Mouse {
  subscriptions = [];
  displaySubscriptions = new Map();
  runSubscriptions = [];

  constructor (app) {
    this._app = app;
    this._pressed = false;
  }

  registerDisplay (display) {
    this.displaySubscriptions.set(display, [
      domEvents.get('mousedown', display.canvas).subscribe(this.onPointerDown(display).bind(this)),
      domEvents.get('mouseenter', display.canvas).subscribe(this.onPointerEnter(display).bind(this))
    ]);
  }

  unregisterDisplay (display) {
    if (this.displaySubscriptions.has(display)) {
      this.displaySubscriptions.get(display).forEach(subscription => subscription.unsubscribe());
      this.displaySubscriptions.delete(display);
    }
  }

  register () { /* empty */ }
  unregister () { /* empty */ }

  // ####

  onContextMenu (display) {
    return (e) => {
      this.runActionResult(contextMenu.bind(this)(e, display));
    };
  }

  onPointerEnter (display) {
    return (e) => {
      this.app.setDisplay(display);
      const subscription = domEvents.get('mouseleave', e.target).subscribe((e) => {
        subscription.unsubscribe();
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
      this.app.display.renderCanvas();
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
        this.runSubscriptions = [
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
    this.runSubscriptions.filter(subscription => !subscription.unsubscribe());
  }
}

let pointerHoldInterval;

function stopPointerDownHold () {
  window.clearInterval(pointerHoldInterval);
  pointerHoldInterval = null;
}

function pointerHoldLoop (cb) {
  stopPointerDownHold();
  pointerHoldInterval = window.setInterval(cb, POINTER_HOLD_INTERVAL);
}

function getPointerEvent (e, display) {
  const canvasLayout = display.canvasLayout;

  let positionInDisplay = ipoint(e.clientX - display.bounds.min.x, e.clientY - display.bounds.min.y);
  let positionInCanvas = ipoint(() => positionInDisplay - canvasLayout.position);

  if (this.app.globalBounds) {
    positionInDisplay = ipoint(() => positionInDisplay - this.app.globalBounds.min);
    positionInCanvas = ipoint(() => positionInCanvas - this.app.globalBounds.min);
  }

  const origin = ipoint(() => Math.round(positionInCanvas));

  const position = ipoint(() => Math.round((positionInCanvas / display.zoomFactor) + display.zoomBounds.min));

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
