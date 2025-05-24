import { v4 as uuidv4 } from 'uuid';
import { Subject } from 'rxjs';
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import { markRaw, toRaw } from 'vue';
import Window from './Window';
import Event from './Event';
import type Core from './Core';
import { FileSystemSymbolWrapper } from './SymbolWrapper/FileSystem';
import type { Layout } from '../types';
import { ITEM_META } from './FileSystem/types';
import type {
  WindowOptions,
  WindowTemplate,
  WindowWrapperLayout
} from '../types/window';

export enum WINDOW_POSITION {
  CENTER = 0,
  ORDER_HORIZONTAL = 1,
  ORDER_VERTICAL = 2,
  ORDER_DIAGONAL_LEFT = 3,
  ORDER_DIAGONAL_RIGHT = 4,
  SPLIT_HORIZONTAL = 5,
  SPLIT_VERTICAL = 6,
  FULL = 7
}

export class WindowEvent extends Event<Window> {}

export default class WindowWrapper {
  events: Subject<WindowEvent> = markRaw(new Subject());
  id: string = uuidv4();
  core;
  layout: WindowWrapperLayout = {
    size: ipoint(0, 0),
    position: ipoint(0, 0)
  };

  groups = new Map();

  modelMap: Map<string, Window> = new Map();
  models: Window[] = [];
  _activeWindow?: Window = undefined;

  constructor(core: Core, models: (Window | WindowTemplate)[] = []) {
    this.core = core;
    models.forEach(model => this.add(model));
  }

  setLayout(layout: Partial<WindowWrapperLayout>) {
    if (layout.position) {
      this.layout.position = ipoint(layout.position.x, layout.position.y);
    }
    if (layout.size) {
      this.layout.size = ipoint(layout.size.x, layout.size.y);
    }
  }

  getActiveWindow() {
    return this.models.find(model => model.options.focused);
  }

  setActiveWindow(id: string) {
    this.models.forEach(model => {
      model.options.focused = id === model.id;
      if (id === model.id) {
        this._activeWindow = model;
        this.events.next(new Event({ name: 'setActiveWindow', value: model }));
      }
    });
  }

  hasEmbbedWindow() {
    return !!this.models.find(model => {
      return model.options.embed;
    });
  }

  isHeaderVsible() {
    return !this.models.find(
      model => model.options.embed && model.options.hideRootHeader
    );
  }

  add(template: Window | WindowTemplate, options?: WindowOptions) {
    const { full, maximize, active, group } = {
      full: false,
      maximize: false,
      active: true,
      group: null,
      ...(options || {})
    };

    let model: Window;
    if (!(template instanceof Window)) {
      model = new Window(template);
    } else {
      model = template;
    }

    model.setWrapper(this);

    if (maximize) {
      model.layout.size = ipoint(this.layout.size.x, this.layout.size.y);
    } else if (full) {
      // ipoint(this.layout.size.x, this.layout.size.y) + ipoint(0, HEADER_HEIGHT)
      model.layout.size = ipoint(
        () => ipoint(this.layout.size.x, this.layout.size.y) + ipoint(0, 0)
      );
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

    model.layout.zIndex = this.models.length;
    this.models.push(model);
    this.events.next(new Event({ name: 'add', value: model }));
    this.modelMap.set(model.id, model);
    if (active) {
      this.setActiveWindow(model.id);
    }
    return model;
  }

  remove(model: Window | string) {
    let windowModel: Window | undefined;
    if (model instanceof Window) {
      windowModel = model;
    } else {
      windowModel = this.get(model);
    }
    if (windowModel !== undefined) {
      if (windowModel.group) {
        if (windowModel.group.primary === model) {
          windowModel.group.windows.forEach(window => window.close());
          this.groups.delete(windowModel.group.name);
        } else {
          windowModel.group.primary.focus();
        }
      }
      this.models.splice(this.models.indexOf(windowModel), 1);
      this.modelMap.delete(windowModel.id);
    }
  }

  get(id: string) {
    return this.modelMap.get(id);
  }

  clear() {
    this.models = [].splice(0, this.models.length);
    this.modelMap.clear();
  }

  setWindowUpDown(id: string, down: boolean) {
    const models = this.models;

    const sortedModels = Array.from(models)
      .filter(model => !model.options.embed)
      .sort((a, b) => (a.layout.zIndex || 0) - (b.layout.zIndex || 0))
      .map(toRaw);

    const model = this.get(id);
    if (model) {
      const index = sortedModels.findIndex(({ id }) => id === model.id);
      const nextModel = sortedModels[down ? index - 1 : index + 1];

      if (nextModel) {
        const lastZIndex = model.layout.zIndex;
        model.layout.zIndex = nextModel.layout.zIndex;
        nextModel.layout.zIndex = lastZIndex;
      }
    }
  }

  centerWindow(model: Window | string) {
    let windowModel: Window | undefined;
    if (model instanceof Window) {
      windowModel = model;
    } else {
      windowModel = this.get(model);
    }
    if (windowModel) {
      centerWindow(windowModel, this.layout);
    }
  }

  setWindowPositions(
    type: WINDOW_POSITION,
    windows: Window[] = [],
    options?: WindowOptions
  ) {
    const { embed } = { embed: false, ...options };
    if (windows.length < 1) {
      windows.push(...this.models);
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

  saveSize(id: string, size: IPoint) {
    const model = this.get(id);
    if (model) {
      if (
        model.componentData?.symbolWrapper &&
        model.componentData?.symbolWrapper instanceof FileSystemSymbolWrapper
      ) {
        const fsItem = model.componentData?.symbolWrapper.fsItem;
        if (fsItem) {
          fsItem.meta.set(ITEM_META.WINDOW_SIZE, size);
          this.core.modules.files?.fs.saveItem(fsItem);
        }
      }
    }
  }

  savePosition(id: string, position: IPoint) {
    const model = this.get(id);
    if (model) {
      if (
        model.componentData?.symbolWrapper &&
        model.componentData?.symbolWrapper instanceof FileSystemSymbolWrapper
      ) {
        const fsItem = model.componentData?.symbolWrapper.fsItem;
        if (fsItem) {
          fsItem.meta.set(ITEM_META.WINDOW_POSITION, position);
          this.core.modules.files?.fs.saveItem(fsItem);
        }
      }
    }
  }
}

function fullWindow(window: Window, layout: Layout) {
  window.layout.size = layout.size;
}

function centerWindow(window: Window, layout: Layout) {
  window.layout.position = ipoint(
    () =>
      (ipoint(layout.size.x, layout.size.y) -
        ipoint(window.layout.size.x, window.layout.size.y)) /
      2
  );
}

function windowPositionDiagonal(
  windows: Window[],
  layout: Layout,
  invert: boolean
) {
  const offset = 1 / windows.length;
  windows.forEach((window, i) => {
    centerWindow(window, layout);
    i = -Math.floor(windows.length / 2) + i;
    const position = ipoint(
      window.layout.position.x +
        (invert ? -1 : 1) * (offset * window.layout.size.x) * i,
      window.layout.position.y + offset * window.layout.size.y * i
    );
    const min = ipoint(
      () =>
        ipoint(layout.size.x, layout.size.y) -
        ipoint(window.layout.size.x, window.layout.size.y)
    );
    window.layout.position = ipoint(() => Math.max(Math.min(position, min), 0));
  });
}

function windowPositionSplit(
  windows: Window[],
  layout: Layout,
  vertical: boolean
) {
  let position: IPoint & number;
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
