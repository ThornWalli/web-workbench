import DottedFreehand from './DottedFreehand';

export default class AirBrush extends DottedFreehand {
  constructor (options = {}) {
    options.pointerDownHold = true;
    super(options);
  }
}
