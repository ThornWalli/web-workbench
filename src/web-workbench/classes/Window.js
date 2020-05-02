import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ipoint } from '@js-basics/vector';
import Event from './Event';

export const DEFAULT_WINDOW_SIZE = ipoint(0, 0);
export default class Window {
  #events = new Subject();
  id = uuidv4();
  title;
  component;
  componentData;

  sidebarComponent;
  sidebarComponentData;

  options = {
    scale: true,
    scrollX: true,
    scrollY: true,
    clampX: true,
    clampY: false,
    freeze: false,
    focused: false,
    close: true,
    overlay: true,
    embed: false,
    borderless: false,
    hideRootHeader: false
  };

  symbolWrapper = null;

  /**
   * Window Wrapper
   */
  wrapper = null;

  layout = {
    focused: false,
    position: ipoint(400, 400),
    size: DEFAULT_WINDOW_SIZE,
    scrollOffset: ipoint(0, 0)
  }

  constructor ({
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
    this.title = title;

    this.sidebarComponent = sidebarComponent;
    this.sidebarComponentData = sidebarComponentData;

    this.component = component;
    this.componentData = Object.assign({}, componentData, { window: this });
    this.symbolWrapper = symbolWrapper;
    this.wrapper = wrapper;
    this.options = Object.assign(this.options, options);
    this.layout = Object.assign(this.layout, layout);
  }

  ready () {
    this.options.ready = true;
    this.#events.next(new Event('ready'));
  }

  focus () {
    this.options.focused = true;
    this.#events.next(new Event('focus'));
  }

  unfocus () {
    this.options.focused = false;
    this.#events.next(new Event('unfocus'));
  }

  close (arg) {
    if (this.wrapper) {
      this.#events.next(new Event('close', arg));
      this.wrapper.remove(this.id);
      this.wrapper = null;
    }
  }

  setWrapper (wrapper) {
    this.wrapper = wrapper;
  }

  get events () {
    return this.#events;
  }
}

export function generateWindows (windows) {
  return windows.map(window => window instanceof Window ? window : new Window(window));
}
