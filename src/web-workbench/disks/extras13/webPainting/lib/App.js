import { Subject } from 'rxjs';
import Canvas from './Canvas';
import Color from './Color';
import InputKeyboard from './input/Keyboard';
import InputMouse from './input/Mouse';

import { getToolByIndex } from './Tool';
import { getBrushByIndex } from './Brush';
import Display from './Display';
import viewport from '@/web-workbench/services/viewport';
import Event from '@/web-workbench/classes/Event';

export const DISPLAY_SPLIT_VALUES = {
  FULL: 0,
  HALF: 1,
  THIRD: 2,
  QUARTER: 3
};

export default class App {
  events = new Subject();
  #globalBounds;

  fsItem;

  options = {
    size: { width: 100, height: 100 },
    windowBackground: '#FFFFFF'
  }

  #density = 1;

  displaySplit = DISPLAY_SPLIT_VALUES.FULL;
  displays = [];
  display;

  #canvas;
  primaryColor;
  secondaryColor;

  #inputs;

  brush;
  brushSelect = {
    size: 1,
    index: 0
  }

  colorSelect = {
    index: 0,
    primaryColor: new Color(Color.COLOR_BLACK),
    secondaryColor: new Color(Color.COLOR_WHITE),
    colorSteps: new Color(1, 1, 1)
  }

  tool;
  toolSelect = {
    value: '',
    index: 1,
    filled: false
  }

  setDisplay (display) {
    if (this.display) {
      this.display.hideCursor();
    }
    this.display = display;
    this.display.showCursor();
  }

  constructor (globalBounds) {
    // Variables

    this.#globalBounds = globalBounds;
    this.#canvas = new Canvas(this);

    // Properties

    this.primaryColor = this.colorSelect.primaryColor;
    this.secondaryColor = this.colorSelect.secondaryColor;

    this.setBrush(this.brushSelect);
    this.setTool(this.toolSelect);

    // Events
    this.subscribtions = [
      viewport.resize.subscribe(this.onViewportRefresh.bind(this))
    ];

    // Initialize Inputs
    this.#inputs = {
      keyboard: new InputKeyboard(this),
      mouse: new InputMouse(this)
    };
    Object.values(this.#inputs).forEach((input) => {
      input.register();
    });
  }

  destroy () {
    this.subscribtions.forEach(subscription => subscription.unsubscribe());
  }

  refreshDisplays () {
    this.displays.forEach((display) => {
      display.refresh();
    });
  }

  onViewportRefresh () {
    this.refreshDisplays();
  }

  /**
     * @param {Display}
     */
  addDisplay (display) {
    display = display || new Display(this);
    this.displays.push(display);
    display.app = this;
    this.events.next(new Event('addDisplay', display, this));
    this.canvas.render();
    return display;
  }

  clearDisplays () {
    this.displays.forEach((display) => {
      display.destroy();
      this.events.next(new Event('removeDisplay', display, this));
    });
    this.displays = [];
  }

  getDisplay (id) {
    return this.displays.find((display) => {
      if (display.id === id) {
        return display;
      }
    });
  }

  get inputs () {
    return this.#inputs;
  }

  get globalBounds () {
    return this.#globalBounds;
  }

  get canvas () {
    return this.#canvas;
  }

  get density () {
    return this.#density;
  }

  set density (value) {
    this.#density = value;
  }

  /**
     * @param  {Number} index
     */
  setBrush ({ index, size }) {
    this.brush = new (getBrushByIndex(index))({
      app: this,
      size
    });
    if (this.tool) {
      this.tool.brush = this.brush;
    }
    this.events.next(new Event('change:brush', this.brush, this));
  }

  setBrushSize (size) {
    this.brush.size = size;
  }

  /**
     * @param  {Number} index
     */
  setTool ({ index }) {
    const tool = new (getToolByIndex(index))({
      app: this,
      brush: this.brush
    });
      // if (tool.passive) {
      //     tool.onActive();
      //         console.log('revert??');
      // } else {
    this.tool = tool;
    this.tool.onActive();
    this.events.next(new Event('change:tool', this.tool, this));
    // }
  }

  get colorSteps () {
    return this.colorSelect.colorSteps;
  }

  set colorSteps (value) {
    this.colorSelect.colorSteps = value;
  }

  // get colorPalette () {
  //   return this.colorPalette;
  // }

  // set colorPalette (value) {
  //   this._flatColorPalette = value.map((color) => {
  //     return `${color[0]}${color[1]}${color[2]}`;
  //   });
  //   console.log(this._flatColorPalette);
  //   this._colorPalette = value;
  // }
}
