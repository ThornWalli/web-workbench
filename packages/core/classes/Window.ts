import { Subject, filter } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import {
  markRaw,
  reactive,
  type Component,
  type Raw,
  type Reactive
} from 'vue';
import Event from './Event';
import type WindowWrapper from './WindowWrapper';
import type { Layout } from '../types';
import type { ISymbolWrapper } from './SymbolWrapper';

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

export interface WindowGroup {
  name: string;
  primary: Window;
  windows: Window[];
}

export interface WindowLayout extends Layout {
  scrollOffset?: IPoint;
  focused?: boolean;
  zIndex?: number;
}

export const DEFAULT_WINDOW_SIZE = ipoint(0, 0);

export interface WindowTemplate {
  sidebarComponent?: Raw<Component> | Component;
  sidebarComponentData?: Raw<object> | object;
  component?: Raw<Component> | Component;
  componentData?: { [key: string]: unknown };
  options?: WindowOptions;
  wrapper?: WindowWrapper;
  layout?: Partial<WindowLayout>;
  parentWindow?: Window;
}
export default class Window implements WindowTemplate {
  events = new Subject<Event<boolean | unknown | undefined>>();
  id = uuidv4();

  component?: Component | Raw<Component>;
  componentData?: {
    window: Window;
    symbolWrapper?: Raw<ISymbolWrapper>;
    [key: string]: unknown;
  };
  sidebarComponent?: Component | Raw<Component>;
  sidebarComponentData?: object;

  parentWindow?: Window;

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

  group?: WindowGroup;
  wrapper?: WindowWrapper;

  layout: Reactive<WindowLayout> = reactive({
    focused: false,
    position: ipoint(0, 0),
    size: DEFAULT_WINDOW_SIZE,
    scrollOffset: ipoint(0, 0),
    zIndex: 0
  });

  constructor({
    sidebarComponent,
    sidebarComponentData,
    component,
    componentData,
    options,
    wrapper,
    layout,
    parentWindow
  }: WindowTemplate) {
    this.parentWindow = parentWindow;

    if (sidebarComponent) {
      this.sidebarComponent = markRaw(sidebarComponent);
    }
    if (sidebarComponentData) {
      this.sidebarComponentData = markRaw(sidebarComponentData);
    }

    if (component) {
      this.component = markRaw(component);
    }

    this.componentData = { window: this, ...(componentData || {}) };

    if (wrapper) {
      this.wrapper = markRaw(wrapper);
    }

    this.options = Object.assign(this.options, options);
    this.layout = Object.assign(this.layout, layout);
  }

  setLayout(layout: Partial<WindowLayout>) {
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

  close<TValue = unknown>(value?: TValue) {
    if (this.wrapper) {
      this.events.next(new Event<TValue>({ name: 'close', value: value }));
      this.wrapper.remove(this.id);
      this.wrapper = undefined;
    }
  }

  setWrapper(wrapper: WindowWrapper) {
    this.wrapper = markRaw(wrapper);
  }

  setGroup(group: WindowGroup) {
    this.group = group;
  }

  awaitClose<TValue = unknown | undefined>(): Promise<Event<TValue>> {
    return new Promise(resolve => {
      const subscription = (this.events as Subject<Event<TValue>>)
        .pipe(filter(({ name }) => name === 'close'))
        .subscribe(event => {
          subscription.unsubscribe();
          resolve(event);
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
