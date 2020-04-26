import Tool from './Tool';

export default class Clear extends Tool {
  constructor (options) {
    super(options);
    this.passive = true;
  }

  onActive () {
    this.app.canvas.clearStack();
  }
}
