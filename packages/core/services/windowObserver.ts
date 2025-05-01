import { v4 as uuidv4 } from 'uuid';
import type Window from '../classes/Window';

class WindowObserver {
  windowMap: Map<string, Window> = new Map();
  windows: Window[] = [];

  add(window: Window) {
    const id = uuidv4();
    window.id = id;
    window.layout.zIndex = this.windows.length;
    this.windows.push(window);
    this.windowMap.set(id, window);
  }

  remove(window: Window) {
    this.windows.splice(this.windows.indexOf(window), 1);
    this.windowMap.delete(window.id);
  }

  get(id: string) {
    return this.windowMap.get(id);
  }

  has(id: string) {
    return this.windowMap.has(id);
  }

  clear() {
    this.windows = [].splice(0, this.windows.length);
    this.windowMap.clear();
  }

  setWindowUpDown(id: string, down: boolean) {
    const windows = this.windows;
    const window = this.get(id);
    if (window) {
      const index = windows.indexOf(window);
      if ((!down && index + 1 < windows.length) || (down && index - 1 >= 0)) {
        const newIndex = down ? index - 1 : index + 1;
        const oldWindow = windows[Number(newIndex)].layout.zIndex;
        windows[Number(newIndex)].layout.zIndex =
          windows[Number(index)].layout.zIndex;
        windows[Number(index)].layout.zIndex = oldWindow;
      }
    }
  }
}

export default new WindowObserver();
