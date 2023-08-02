
import { v4 as uuidv4 } from 'uuid';

class WindowObserver {
  #windowMap = new Map();
  windows = [];

  add (window) {
    const id = uuidv4();
    window.id = id;
    window.layout.zIndex = this.windows.length;
    this.windows.push(window);
    this.#windowMap.set(id, window);
  }

  remove (window) {
    this.windows.splice(this.windows.indexOf(window), 1);
    this.#windowMap.delete(window.id);
  }

  get (id) {
    return this.#windowMap.get(id);
  }

  clear () {
    this.windows = [].splice(0, this.windows.length);
    this.#windowMap.clear();
  }

  setWindowUpDown (id, down) {
    const windows = this.windows;
    const index = windows.indexOf(this.get(id));
    if ((!down && (index + 1) < windows.length) || (down && (index - 1) >= 0)) {
      const newIndex = down ? (index - 1) : (index + 1);
      const oldWindow = windows[Number(newIndex)].layout.zIndex;
      windows[Number(newIndex)].layout.zIndex = windows[Number(index)].layout.zIndex;
      windows[Number(index)].layout.zIndex = oldWindow;
    }
  }
}

export default new WindowObserver();
