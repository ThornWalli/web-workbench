import { Subject, filter } from 'rxjs';
import { ipoint } from '@js-basics/vector';
import { markRaw, reactive } from 'vue';
import type { Component, Raw, Reactive } from 'vue';
import Event from './Event';
import type { EventValue } from './Event';
import type WindowWrapper from './WindowWrapper';
import type { ISymbolWrapper } from './SymbolWrapper';
import type {
  WindowGroup,
  WindowLayout,
  WindowOptions,
  WindowTemplate
} from '../types/window';

export const DEFAULT_WINDOW_SIZE = ipoint(0, 0);

export default class Window implements WindowTemplate {
  events = new Subject<Event>();
  id = crypto.randomUUID();

  component?: Component | Raw<Component>;
  componentData?: {
    symbolWrapper?: Raw<ISymbolWrapper>;
    [key: string]: unknown;
  };
  sidebarComponent?: Component | Raw<Component>;
  sidebarComponentData?: object;

  parentWindow?: Window;

  options: Reactive<WindowOptions> = reactive({
    title: undefined,
    scale: false,
    scaleX: false,
    scaleY: false,
    scroll: false,
    scrollX: false,
    scrollY: false,
    clamp: false,
    clampX: true,
    clampY: false,
    freeze: false,
    focused: false,
    center: true,
    close: true,
    overlay: true,
    embed: false,
    fillHeader: false,
    filled: false,
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

    this.componentData = { ...(componentData || {}) };

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

  close<TValue extends EventValue = EventValue>(value?: TValue) {
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

  awaitClose<TEvent extends Event = Event>(): Promise<TEvent> {
    return new Promise<TEvent>(resolve => {
      const subscription = (this.events as unknown as Subject<TEvent>)
        .pipe(filter(({ name }) => name === 'close'))
        .subscribe(event => {
          subscription.unsubscribe();
          resolve(event as TEvent);
        });
    });
  }

  awaitReady() {
    return new Promise<Window>(resolve => {
      if (this.options.ready) {
        resolve(this);
      } else {
        const subscription = this.events
          .pipe(filter(({ name }) => name === 'ready'))
          .subscribe(() => {
            subscription.unsubscribe();
            resolve(this);
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
