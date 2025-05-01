import type { IPoint } from '@js-basics/vector';
import type App from './App';

export default class ExtendedPointerEvent {
  position: IPoint & number;
  origin;
  app: App;
  x: number;
  y: number;
  originX: number;
  originY: number;
  leftClick: boolean;
  rightClick: boolean;
  holdAlt: boolean;
  holdCtrl: boolean;

  constructor({
    position,
    origin,
    app,
    x,
    y,
    originX,
    originY,
    leftClick,
    rightClick,
    holdAlt,
    holdCtrl
  }: {
    position: IPoint & number;
    origin: unknown;
    app: App;
    x: number;
    y: number;
    originX: number;
    originY: number;
    leftClick: boolean;
    rightClick: boolean;
    holdAlt: boolean;
    holdCtrl: boolean;
  }) {
    this.position = position;
    this.origin = origin;
    this.app = app;
    this.x = x;
    this.y = y;
    this.originX = originX;
    this.originY = originY;
    this.leftClick = leftClick;
    this.rightClick = rightClick;
    this.holdAlt = holdAlt;
    this.holdCtrl = holdCtrl;
  }
}
