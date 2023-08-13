import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ipoint } from '@js-basics/vector';
import { markRaw, reactive } from 'vue';
import Event from './Event';

export const DEFAULT_WINDOW_SIZE = ipoint(0, 0);
export default class Window {
  #events = new Subject();
  id = uuidv4();
  component;
  componentData;

  sidebarComponent;
  sidebarComponentData;

  options = reactive({
    title: 'Unnamed',
    scale: true,
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
    sidebar: true
  });

  symbolWrapper = null;
  group = null;

  /**
   * Window Wrapper
   */
  wrapper = null;

  layout = reactive({
    focused: false,
    position: ipoint(0, 0),
    size: DEFAULT_WINDOW_SIZE,
    scrollOffset: ipoint(0, 0)
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
    layout
  }) {
    this.options.title = title;

    sidebarComponent && (this.sidebarComponent = markRaw(sidebarComponent));
    sidebarComponentData &&
      (this.sidebarComponentData = markRaw(sidebarComponentData));

    this.component = markRaw(component);
    this.componentData = { ...componentData, window: this };
    symbolWrapper && (this.symbolWrapper = markRaw(symbolWrapper));
    wrapper && (this.wrapper = markRaw(wrapper));
    this.options = Object.assign(this.options, options);
    this.layout = Object.assign(this.layout, layout);
  }

  ready() {
    this.options.ready = true;
    this.#events.next(new Event('ready'));
  }

  focus() {
    this.options.focused = true;
    this.#events.next(new Event('focus'));
  }

  unfocus() {
    this.options.focused = false;
    this.#events.next(new Event('unfocus'));
  }

  close(arg) {
    if (this.wrapper) {
      this.#events.next(new Event('close', arg));
      this.wrapper.remove(this.id);
      this.wrapper = null;
    }
  }

  setWrapper(wrapper) {
    this.wrapper = markRaw(wrapper);
  }

  setGroup(group) {
    this.group = group;
  }

  get events() {
    return this.#events;
  }
}

export function generateWindows(windows) {
  return windows.map(window =>
    window instanceof Window ? window : new Window(window)
  );
}
