import { Subject, filter } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ipoint } from '@js-basics/vector';
import {
  markRaw,
  reactive,
  type Component,
  type Raw,
  type Reactive
} from 'vue';
import Event from './Event';
import type SymbolWrapper from './SymbolWrapper';
import type WindowWrapper from './WindowWrapper';

export interface WindowOptions {
  title?: string;
  scale?: boolean;
  scaleX?: boolean;
  scaleY?: boolean;
  scrollX?: boolean;
  scrollY?: boolean;
  clampX?: boolean;
  clampY?: boolean;
  freeze?: boolean;
  focused?: boolean;
  center?: boolean;
  close?: boolean;
  overlay?: boolean;
  embed?: boolean;
  borderless?: boolean;
  hideRootHeader?: boolean;
  sidebar?: boolean;
  prompt?: boolean;
  ready?: boolean;
}

export interface WindowLayout {
  position?: { x: number; y: number };
  size?: { x: number; y: number };
  scrollOffset?: { x: number; y: number };
  focused?: boolean;
}

export interface ConstructorArgs {
  title?: string;
  sidebarComponent?: unknown;
  sidebarComponentData?: unknown;
  component: Component;
  componentData?: { [key: string]: unknown };
  options?: WindowOptions;
  symbolWrapper?: Raw<SymbolWrapper>;
  wrapper?: WindowWrapper;
  layout?: { [key: string]: unknown };
  parentWindow?: Window;
}

export const DEFAULT_WINDOW_SIZE = ipoint(0, 0);
export default class Window {
  events = new Subject<Event>();
  id = uuidv4();
  component;
  componentData: {
    window: Window;
    [key: string]: unknown;
  };

  sidebarComponent;
  sidebarComponentData;

  parentWindow;

  options: Reactive<WindowOptions> = reactive({
    title: 'Unnamed',
    scaleX: true,
    scaleY: true,
    scrollX: true,
    scrollY: true,
    clampX: true,
    clampY: false,
    freeze: false,
    focused: false,
    center: true,
    close: true,
    overlay: true,
    embed: false,
    borderless: false,
    hideRootHeader: false,
    sidebar: true,
    prompt: false
  });

  symbolWrapper?: Raw<SymbolWrapper>;
  group?: unknown;
  wrapper?: WindowWrapper;

  layout = reactive({
    focused: false,
    position: ipoint(0, 0),
    size: DEFAULT_WINDOW_SIZE,
    scrollOffset: ipoint(0, 0),
    zIndex: 0
  });

  constructor({
    title,
    sidebarComponent,
    sidebarComponentData,
    component,
    componentData,
    options,
    symbolWrapper,
    wrapper,
    layout,
    parentWindow
  }: ConstructorArgs) {
    this.options.title = title;
    this.parentWindow = parentWindow;

    if (sidebarComponent) {
      this.sidebarComponent = markRaw(sidebarComponent);
    }
    if (sidebarComponentData) {
      this.sidebarComponentData = markRaw(sidebarComponentData);
    }

    this.component = markRaw(component);
    this.componentData = { window: this, ...componentData };

    if (symbolWrapper) {
      this.symbolWrapper = markRaw(symbolWrapper);
    }

    if (wrapper) {
      this.wrapper = markRaw(wrapper);
    }

    this.options = Object.assign(this.options, options);
    this.layout = Object.assign(this.layout, layout);
  }

  setLayout(layout: WindowLayout) {
    if (layout.position) {
      this.layout.position = ipoint(layout.position.x, layout.position.y);
    }
    if (layout.size) {
      this.layout.size = ipoint(layout.size.x, layout.size.y);
    }
    if (layout.scrollOffset) {
      this.layout.scrollOffset = ipoint(
        layout.scrollOffset.x,
        layout.scrollOffset.y
      );
    }
    if (layout.focused) {
      this.layout.focused = layout.focused;
    }
  }

  ready() {
    this.options.ready = true;
    this.events.next(new Event({ name: 'ready' }));
  }

  focus() {
    this.options.focused = true;
    this.events.next(new Event({ name: 'focus' }));
  }

  unfocus() {
    this.options.focused = false;
    this.events.next(new Event({ name: 'unfocus' }));
  }

  close(value?: unknown) {
    if (this.wrapper) {
      this.events.next(new Event({ name: 'close', value: value }));
      this.wrapper.remove(this.id);
      this.wrapper = undefined;
    }
  }

  setWrapper(wrapper: WindowWrapper) {
    this.wrapper = markRaw(wrapper);
  }

  setGroup(group: unknown) {
    this.group = group;
  }

  awaitClose() {
    return new Promise(resolve => {
      const subscription = this.events
        .pipe(filter(({ name }) => name === 'close'))
        .subscribe((...args) => {
          subscription.unsubscribe();
          resolve(...args);
        });
    });
  }

  awaitReady() {
    return new Promise(resolve => {
      if (this.options.ready) {
        resolve(this);
      } else {
        const subscription = this.events
          .pipe(filter(({ name }) => name === 'ready'))
          .subscribe((...args) => {
            subscription.unsubscribe();
            resolve(...args);
          });
      }
    });
  }
}

export function generateWindows(windows: Window[]) {
  return windows.map(window =>
    window instanceof Window ? window : new Window(window)
  );
}
