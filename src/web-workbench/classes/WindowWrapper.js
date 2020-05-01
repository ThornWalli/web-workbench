import { v4 as uuidv4 } from 'uuid';
import { Subject } from 'rxjs';
import { ipoint } from '@js-basics/vector';
import Window from './Window';
import Event from './Event';

export const WINDOW_POSITION = {
  CENTER: 0,
  ORDER_HORIZONTAL: 1,
  ORDER_VERTICAL: 2,
  ORDER_DIAGONAL_LEFT: 3,
  ORDER_DIAGONAL_RIGHT: 4,
  SPLIT_HORIZONTAL: 5,
  SPLIT_VERTICAL: 6,
  FULL: 7
};

export default class WindowWrapper {
  #events = new Subject();
  #id = uuidv4();
  #core;
  layout = {
    size: ipoint(0, 0),
    position: ipoint(0, 0)
  }

  #modelMap = new Map();
  models = [];

  constructor (core, models = []) {
    this.#core = core;
    models.forEach(model => this.add(model));
  }

  getActiveWindow () {
    return this.models.find(model => model.options.focused);
  }

  setActiveWindow (id) {
    this.models.forEach((model) => {
      model.options.focused = id === model.id;
      if (id === model.id) {
        this.#events.next(new Event('setActiveWindow', model));
      }
    });
  }

  add (model, options) {
    const { full, active } = Object.assign({ full: false, active: true }, options);
    if (!(model instanceof Window)) {
      model = new Window(model);
    }
    model.setWrapper(this);
    if (full) {
      model.layout.size = this.layout.size;
    }

    model.layout.zIndex = this.models.length;
    this.models.push(model);
    this.#modelMap.set(model.id, model);
    if (active) {
      this.setActiveWindow(model.id);
    }
    return model;
  }

  remove (model) {
    if (typeof model === 'string') {
      model = this.get(model);
    }
    this.models.splice(this.models.indexOf(model), 1);
    this.#modelMap.delete(model.id);
  }

  get (id) {
    return this.#modelMap.get(id);
  }

  clear () {
    this.models = [].splice(0, this.models.length);
    this.#modelMap.clear();
  }

  setWindowUpDown (id, down) {
    const models = this.models;
    const index = models.indexOf(this.get(id));
    if ((!down && (index + 1) < models.length) || (down && (index - 1) >= 0)) {
      const newIndex = down ? (index - 1) : (index + 1);
      const oldModel = models[Number(newIndex)].layout.zIndex;
      models[Number(newIndex)].layout.zIndex = models[Number(index)].layout.zIndex;
      models[Number(index)].layout.zIndex = oldModel;
    }
  }

  centerWindow (window) {
    if (typeof window === 'string') {
      window = this.get(window);
    }
    centerWindow(window, this.layout);
  }

  // eslint-disable-next-line complexity
  setWindowPositions (type, windows = []) {
    if (windows.length < 1) {
      windows.push(...this.models);
    }
    switch (type) {
      case WINDOW_POSITION.FULL:
        windows.forEach((window) => {
          fullWindow(window, this.layout);
        });
        break;
      case WINDOW_POSITION.CENTER:
        windows.forEach((window) => {
          centerWindow(window, this.layout);
        });
        break;
      case WINDOW_POSITION.ORDER_DIAGONAL_LEFT:
      case WINDOW_POSITION.ORDER_DIAGONAL_RIGHT:
        windowPositionDiagonal(windows, this.layout, WINDOW_POSITION.ORDER_DIAGONAL_RIGHT === type);

        break;
      case WINDOW_POSITION.SPLIT_HORIZONTAL:
      case WINDOW_POSITION.SPLIT_VERTICAL:
        windowPositionSplit(windows, this.layout, WINDOW_POSITION.SPLIT_VERTICAL === type);
        break;
    }
  }

  get events () {
    return this.#events;
  }
}

function fullWindow (window, layout) {
  window.layout.size = layout.size;
}

function centerWindow (window, layout) {
  window.layout.position = ipoint(() => (layout.size - window.layout.size) / 2);
}

function windowPositionDiagonal (windows, layout, invert) {
  const offset = 1 / windows.length;
  windows.forEach((window, i) => {
    centerWindow(window, layout);
    i = -Math.floor(windows.length / 2) + i;
    const position = ipoint(
      window.layout.position.x + (invert ? -1 : 1) * (offset * window.layout.size.x) * i,
      window.layout.position.y + offset * window.layout.size.y * i);
    const min = ipoint(() => layout.size - window.layout.size);
    window.layout.position = ipoint(() => Math.max(Math.min(position, min), 0));
  });
}

function windowPositionSplit (windows, layout, vertical) {
  let position;
  const length = windows.length;
  if (vertical) {
    position = ipoint(layout.size.x, layout.size.y / length);
    windows.forEach((window, i) => {
      window.layout.position = ipoint(0, i * position.y);
      window.layout.size = position;
    });
  } else {
    position = ipoint(layout.size.x / length, layout.size.y);
    windows.forEach((window, i) => {
      window.layout.position = ipoint(i * position.x, 0);
      window.layout.size = position;
    });
  }
}
