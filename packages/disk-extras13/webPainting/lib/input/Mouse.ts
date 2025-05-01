import { ipoint } from '@js-basics/vector';
import domEvents from '@web-workbench/core/services/domEvents';
import type App from '../App';
import type Display from '../Display';
import type { Subscription } from 'rxjs';
import ExtendedPointerEvent from '../ExtendedPointerEvent';
import type { PointerResult } from '../types';

const POINTER_HOLD_INTERVAL = 20;

export default class Mouse {
  app: App;
  pressed: boolean;
  pointerEvent?: ExtendedPointerEvent;

  subscriptions = [];
  displaySubscriptions = new Map<Display, [Subscription, Subscription]>();
  runSubscriptions: Subscription[] = [];

  constructor(app: App) {
    this.app = app;
    this.pressed = false;
  }

  registerDisplay(display: Display) {
    this.displaySubscriptions.set(display, [
      domEvents
        .get<PointerEvent>('pointerdown', display.canvas)
        .subscribe(this.onPointerDown(display)),
      domEvents
        .get<PointerEvent>('pointerup', display.canvas)
        .subscribe(this.onPointerEnter(display))
    ]);
  }

  unregisterDisplay(display: Display) {
    if (this.displaySubscriptions.has(display)) {
      this.displaySubscriptions
        .get(display)
        ?.forEach(subscription => subscription?.unsubscribe());
      this.displaySubscriptions.delete(display);
    }
  }

  register() {
    /* empty */
  }

  unregister() {
    /* empty */
  }

  // ####

  onContextMenu(display: Display) {
    return (e: Event) => {
      this.runActionResult(this.contextMenu(e, display), e, display);
    };
  }

  onPointerEnter(display: Display) {
    return (e: PointerEvent) => {
      if (e.target instanceof HTMLElement) {
        this.app.setDisplay(display);
        const subscription = domEvents
          .get<PointerEvent>('pointerleave', e.target)
          .subscribe(e => {
            subscription.unsubscribe();
            this.onPointerLeave(display)(e);
          });
      }
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onPointerLeave(display: Display) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (e: PointerEvent) => {
      // console.warn('Method not implemented.', display, e);
    };
  }

  onPointerDown(display: Display) {
    return (e: PointerEvent) => {
      this.app.setDisplay(display);
      this.pointerEvent = this.getPointerEvent(e, display);
      this.pressed = true;
      this.runActionResult(this.pointerDown(e, display), e, display);
      this.app.display?.renderCanvas();
    };
  }

  onPointerLeaveAndUp(display: Display) {
    return (e: PointerEvent) => {
      stopPointerDownHold();
      this.runActionResult(this.pointerLeaveAndUp(e, display), e, display);
    };
  }

  onPointerMove(display: Display) {
    return (e: PointerEvent) => {
      this.runActionResult(this.pointerMove(e, display), e, display);
    };
  }

  runActionResult(result: PointerResult, e: Event, display: Display) {
    if (result) {
      if (result.events && e.target instanceof HTMLElement) {
        this.runSubscriptions = [
          domEvents
            .get<Event>('contextmenu', e.target)
            .subscribe(this.onContextMenu(display)),
          domEvents
            .get<PointerEvent>('pointerleave', e.target)
            .subscribe(this.onPointerLeaveAndUp(display)),
          domEvents
            .get<PointerEvent>('pointermove', e.target)
            .subscribe(this.onPointerMove(display)),
          domEvents
            .get<PointerEvent>('pointerup', e.target)
            .subscribe(this.onPointerLeaveAndUp(display))
        ];
      }
      if (result.save) {
        this.app.canvas?.saveStack();
      }
      if (result.revert) {
        this.app.canvas?.revertStack();
      }
      if (result.render) {
        this.app.canvas?.render();
      }
    }
  }

  unsubscribeRun() {
    this.runSubscriptions.forEach(subscription => subscription.unsubscribe());
    this.runSubscriptions = [];
  }

  getPointerEvent(e: PointerEvent, display: Display): ExtendedPointerEvent {
    const canvasLayout = display.canvasLayout;

    let positionInDisplay = ipoint(
      e.clientX - display.bounds.min.x,
      e.clientY - display.bounds.min.y
    );
    let positionInCanvas = ipoint(
      () => positionInDisplay - canvasLayout.position
    );

    if (this.app.globalBounds) {
      positionInDisplay = ipoint(
        () => positionInDisplay - this.app.globalBounds.min
      );
      positionInCanvas = ipoint(
        () => positionInCanvas - this.app.globalBounds.min
      );
    }

    const origin = ipoint(() => Math.round(positionInCanvas));

    const position = ipoint(() =>
      Math.round(positionInCanvas / display.zoomFactor + display.zoomBounds.min)
    );

    return new ExtendedPointerEvent({
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
    });
  }

  pointerDown(e: PointerEvent, display: Display): PointerResult {
    const result = {
      events: true
    };

    if (!this.app.tool || !this.app.canvas) {
      throw new Error('Tool or Canvas not found');
    }
    const tool = this.app.tool;
    const canvas = this.app.canvas;

    if (tool.pointerDownHold) {
      pointerHoldLoop(() => {
        this.runActionResult(
          tool.onPointerDown(this.pointerEvent, { mouse: this }),
          e,
          display
        );
        canvas.render();
      });
    } else {
      return Object.assign(
        result,
        tool.onPointerDown(this.pointerEvent, { mouse: this })
      );
    }
    return result;
  }

  pointerLeaveAndUp(e: PointerEvent, display: Display) {
    if (!this.app.tool) {
      throw new Error('Tool not found');
    }
    this.pressed = false;
    this.pointerEvent = undefined;
    this.unsubscribeRun();
    return this.app.tool.onPointerUp(this.getPointerEvent(e, display), {
      mouse: this
    });
  }

  pointerMove(e: PointerEvent, display: Display) {
    if (!this.app.tool) {
      throw new Error('Tool not found');
    }
    this.pointerEvent = this.getPointerEvent(e, display);
    return this.app.tool.onPointerMove(this.pointerEvent, { mouse: this });
  }

  contextMenu(e: Event, display: Display) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.app.tool) {
      throw new Error('Tool not found');
    }
    return this.app.tool?.onContextMenu(e, { mouse: this, display });
  }
}

let pointerHoldInterval: number;

function stopPointerDownHold() {
  window.clearInterval(pointerHoldInterval);
}

function pointerHoldLoop(cb: CallableFunction) {
  stopPointerDownHold();
  pointerHoldInterval = window.setInterval(cb, POINTER_HOLD_INTERVAL);
}
