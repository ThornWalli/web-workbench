import { ellipse as drawEllipse } from '../paintUtils';
import UnfilledFilledEllipse from './UnfilledFilledEllipse';

export default class UnfilledFilledCircle extends UnfilledFilledEllipse {
  constructor(options) {
    super(options);
    this._proportinalScale = true;
    this._func = drawEllipse;
  }
}
