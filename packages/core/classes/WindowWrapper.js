import { v4 as uuidv4 } from 'uuid';
import { Subject } from 'rxjs';
import { ipoint } from '@js-basics/vector';
import { toRaw, ref } from 'vue';
import Window from './Window';
import Event from './Event';
import { ITEM_META } from './FileSystem/Item';

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
  events = new Subject();
  id = uuidv4();
  core;
  layout = {
    size: ipoint(0, 0),
    position: ipoint(0, 0)
  };

  groups = new Map();

  modelMap = new Map();
  models = ref([]);
  activeWindow = ref(null);

  constructor(core, models = []) {
    this.core = core;
    models.forEach(model => this.add(model));
  }

  getActiveWindow() {
    return this.models.value.find(model => model.options.focused);
  }

  setActiveWindow(id) {
    this.models.value.forEach(model => {
      model.options.focused = id === model.id;
      if (id === model.id) {
        this.activeWindow.value = model;
        this.events.next(new Event('setActiveWindow', model));
      }
    });
  }

  hasEmbbedWindow() {
    return !!this.models.value.find(model => {
      return model.options.embed;
    });
  }

  isHeaderVsible() {
    return !this.models.value.find(
      model => model.options.embed && model.options.hideRootHeader
    );
  }

  add(model, options) {
    const { full, active, group } = {
      full: false,
      active: true,
      group: null,
      ...options
    };
    if (!(model instanceof Window)) {
      model = new Window(model);
    }
    model.setWrapper(this);
    if (full) {
      model.layout.size = this.layout.size;
    }

    if (group) {
      let groupObj;
      if (!this.groups.has(group)) {
        groupObj = { primary: model, windows: [], name: group };
        this.groups.set(group, groupObj);
      } else {
        groupObj = this.groups.get(group);
        groupObj.windows.push(model);
      }
      model.setGroup(groupObj);
    }

    model.layout.zIndex = this.models.value.length;
    this.models.value.push(model);
    this.events.next(new Event('add', model));
    this.modelMap.set(model.id, model);
    if (active) {
      this.setActiveWindow(model.id);
    }
    return model;
  }

  remove(model) {
    if (typeof model === 'string') {
      model = this.get(model);
    }
    if (model.group) {
      if (model.group.primary === model) {
        model.group.windows.forEach(window => window.close());
        this.groups.delete(model.group.name);
      } else {
        model.group.primary.focus();
      }
    }
    this.models.value.splice(this.models.value.indexOf(model), 1);
    this.modelMap.delete(model.id);
  }

  get(id) {
    return this.modelMap.get(id);
  }

  clear() {
    this.models = ref([].splice(0, this.models.value.length));
    this.modelMap.clear();
  }

  setWindowUpDown(id, down) {
    const models = this.models.value;

    const sortedModels = Array.from(models)
      .filter(model => !model.options.embed)
      .sort((a, b) => a.layout.zIndex - b.layout.zIndex)
      .map(toRaw);
    const model = this.get(id);
    const index = sortedModels.indexOf(model);
    const nextModel = sortedModels[down ? index - 1 : index + 1];

    if (nextModel) {
      const lastZIndex = model.layout.zIndex;
      model.layout.zIndex = nextModel.layout.zIndex;
      nextModel.layout.zIndex = lastZIndex;
    }
  }

  centerWindow(window) {
    if (typeof window === 'string') {
      window = this.get(window);
    }
    centerWindow(window, this.layout);
  }

  setWindowPositions(type, windows = [], options) {
    const { embed } = { embed: false, ...options };
    if (windows.length < 1) {
      windows.push(...this.models.value);
    }
    if (!embed) {
      windows = windows.filter(window => !window.options.embed);
    }
    switch (type) {
      case WINDOW_POSITION.FULL:
        windows.forEach(window => {
          fullWindow(window, this.layout);
        });
        break;
      case WINDOW_POSITION.CENTER:
        windows.forEach(window => {
          centerWindow(window, this.layout);
        });
        break;
      case WINDOW_POSITION.ORDER_DIAGONAL_LEFT:
      case WINDOW_POSITION.ORDER_DIAGONAL_RIGHT:
        windowPositionDiagonal(
          windows,
          this.layout,
          WINDOW_POSITION.ORDER_DIAGONAL_RIGHT === type
        );

        break;
      case WINDOW_POSITION.SPLIT_HORIZONTAL:
      case WINDOW_POSITION.SPLIT_VERTICAL:
        windowPositionSplit(
          windows,
          this.layout,
          WINDOW_POSITION.SPLIT_VERTICAL === type
        );
        break;
    }
  }

  saveSize(id, size) {
    if (this.get(id).symbolWrapper && this.get(id).symbolWrapper.fsItem) {
      const fsItem = this.get(id).symbolWrapper.fsItem;
      fsItem.meta.set(ITEM_META.WINDOW_SIZE, size);
      this.core.modules.files.fs.saveItem(fsItem);
    }
  }

  savePosition(id, position) {
    if (this.get(id).symbolWrapper && this.get(id).symbolWrapper.fsItem) {
      const fsItem = this.get(id).symbolWrapper.fsItem;
      fsItem.meta.set(ITEM_META.WINDOW_POSITION, position);
      this.core.modules.files.fs.saveItem(fsItem);
    }
  }
}

function fullWindow(window, layout) {
  window.layout.size = layout.size;
}

function centerWindow(window, layout) {
  window.layout.position = ipoint(() => (layout.size - window.layout.size) / 2);
}

function windowPositionDiagonal(windows, layout, invert) {
  const offset = 1 / windows.length;
  windows.forEach((window, i) => {
    centerWindow(window, layout);
    i = -Math.floor(windows.length / 2) + i;
    const position = ipoint(
      window.layout.position.x +
        (invert ? -1 : 1) * (offset * window.layout.size.x) * i,
      window.layout.position.y + offset * window.layout.size.y * i
    );
    const min = ipoint(() => layout.size - window.layout.size);
    window.layout.position = ipoint(() => Math.max(Math.min(position, min), 0));
  });
}

function windowPositionSplit(windows, layout, vertical) {
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
