import { Subscription } from 'rxjs';
import type { IPoint } from '@js-basics/vector';
import type { ToolConstructorOptions, ToolEvent } from '../../Tool';
import GeometryLine, { GEOMETRY_LINE_STATE } from './GeometryLine';
import type { GeometryLineOptions } from './GeometryLine';
import { TOOL } from '../../../../types/select';
import { KEYBOARD_KEY } from '@web-workbench/core/types/dom';
import type ToolPointerEvent from '../../ToolPointerEvent';

export interface PolygonOptions extends GeometryLineOptions {
  anchorDimension?: IPoint & number;
  anchorPositions?: (IPoint & number)[];
  complete?: boolean;
}

export default class Polygon extends GeometryLine<PolygonOptions> {
  lineWidth: number = 2;
  subscription = new Subscription();
  started = false;
  preComplete = false;
  complete = false;

  constructor(options: ToolConstructorOptions<PolygonOptions>) {
    super({ ...options, type: TOOL.POLYGON });

    this.subscription.add(
      this.domEvents?.keyDown.subscribe(async e => {
        if (
          this.startEvent &&
          (e.key === KEYBOARD_KEY.BACKSPACE || e.key === KEYBOARD_KEY.DELETE)
        ) {
          this.anchors = this.anchors.filter(
            anchor => anchor !== this.selectedAnchor
          );
          this.render(this.startEvent);
        }
      })
    );
  }

  override destroy(): void {
    super.destroy();
    this.subscription.unsubscribe();
  }

  override async pointerDown(e: ToolPointerEvent) {
    await super.pointerDown(e);
    const selectedAnchor = this.getAnchorByPosition(e.position);

    if (this.selectedAnchor) {
      if (selectedAnchor) {
        if (selectedAnchor !== this.selectedAnchor) {
          this.preComplete = false;
          this.selectedAnchor = selectedAnchor;
        } else if (this.preComplete) {
          this.complete = true;
          this.selectedAnchor = undefined;
          await this.app.actions.startStack();
          await this.action(
            {
              state: GEOMETRY_LINE_STATE.STOP,
              anchorDimension: e.normalizeDimension(this.anchors[0].dimension),
              anchorPositions: this.anchors.map(anchor =>
                e.normalizePosition(anchor.position)
              ),
              complete: true
            },
            { event: e }
          );
          await this.app.actions.stopStack();
          this.reset(e);
        } else if (selectedAnchor === selectedAnchor) {
          this.preComplete = true;
        }
      } else if (!this.complete) {
        this.selectedAnchor = this.addAnchor(e.position);
        this.action(
          {
            stackable: false,
            state: GEOMETRY_LINE_STATE.MOVE,
            anchorDimension: e.normalizeDimension(this.anchors[0].dimension),
            anchorPositions: this.anchors.map(anchor =>
              e.normalizePosition(anchor.position)
            )
          },
          { event: e }
        );
      }
    } else if (selectedAnchor) {
      this.preComplete = false;
      this.selectedAnchor = selectedAnchor;
    } else {
      this.action(
        {
          state: GEOMETRY_LINE_STATE.START,
          stackable: false
        },
        { event: e }
      );
      this.selectedAnchor = this.addAnchor(e.position);
      this.started = true;
    }
    this.render(e);
  }

  override async pointerMove(e: ToolPointerEvent) {
    if (!this.started) return;
    await super.pointerMove(e);
    if (this.domEvents?.pointerActive) {
      if (this.selectedAnchor) {
        this.selectedAnchor.position = e.position;
      }
      this.render(e);
      this.action(
        {
          stackable: false,
          state: GEOMETRY_LINE_STATE.MOVE,
          anchorDimension: e.normalizeDimension(this.anchors[0].dimension),
          anchorPositions: this.anchors.map(anchor =>
            e.normalizePosition(anchor.position)
          )
        },
        { event: e }
      );
    }
  }

  override reset(e: ToolEvent | ToolPointerEvent): void {
    super.reset(e);
    this.started = false;
    this.complete = false;
    this.preComplete = false;
  }

  render(e: ToolPointerEvent) {
    this.anchors.forEach(anchor => {
      anchor.selected = this.selectedAnchor === anchor;
    });

    e.ctx.clearRect(0, 0, e.ctx.canvas.width, e.ctx.canvas.height);
    // if (this.anchors.length > 1) {
    //   const ctx = e.ctx;
    //   ctx.beginPath();
    //   ctx.moveTo(this.anchors[0].position.x, this.anchors[0].position.y);

    //   for (let i = 1; i < this.anchors.length; i++) {
    //     ctx.lineTo(this.anchors[i].position.x, this.anchors[i].position.y);
    //   }
    //   ctx.closePath();
    //   ctx.strokeStyle = 'red';
    //   ctx.lineWidth = this.lineWidth;
    //   ctx.stroke();
    // }
    this.drawAnchors(e, { stroke: !this.preComplete });
  }
}
