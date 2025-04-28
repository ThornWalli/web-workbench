import Tool, { type ToolOptions } from './Tool';

export default class Clear extends Tool {
  constructor(options: ToolOptions) {
    super(options);
    this.passive = true;
  }

  override onActive() {
    this.app.canvas?.clearStack();
  }
}
