import Tool from './Tool';

export default class Undo extends Tool {
  constructor (options) {
    super(options);
    this.passive = true;
  }

  onActive () {
    this.app.canvas.revertStack();
  }
}
