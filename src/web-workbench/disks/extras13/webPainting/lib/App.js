import { Subscription, Subject } from 'rxjs';
import { ipoint, point } from '@js-basics/vector';
import { markRaw, reactive, ref } from 'vue';
import Canvas from './Canvas';
import Color from './Color';
import InputKeyboard from './input/Keyboard';
import InputMouse from './input/Mouse';

import { getToolByIndex } from './Tool';
import { getBrushByIndex } from './Brush';
import Display from './Display';
import Event from '@/web-workbench/classes/Event';
import viewport from '@/web-workbench/services/viewport';

export const DISPLAY_SPLIT_VALUES = {
  FULL: 0,
  HALF: 1,
  THIRD: 2,
  QUARTER: 3
};

export default class App {
  subscription = new Subscription();
  events = new Subject();
  #globalBounds;

  fsItem;

  options = {
    size: { width: 300, height: 200 },
    display: {
      foreground: '#FFFFFF',
      background: '#000000'
    }
  };

  #density = 1;

  displaySplit = DISPLAY_SPLIT_VALUES.FULL;
  displays = ref([]);
  displaysEl;
  displaysLayout = {
    size: ipoint()
  };

  display;

  #canvas;
  primaryColor;
  secondaryColor;

  #inputs;

  brush;
  brushSelect = {
    size: 1,
    index: 0
  };

  colorSelect = reactive({
    primaryColor: markRaw(new Color(Color.COLOR_BLACK)),
    secondaryColor: markRaw(new Color(Color.COLOR_WHITE)),
    paletteSteps: markRaw(new Color(2, 1, 1))
  });

  tool;
  toolSelect = {
    value: '',
    index: 1,
    filled: false
  };

  cursorCanvas = null;

  setDisplaysElement (displaysEl) {
    this.displaysEl = displaysEl;
  }

  refresh () {
    this.displaysLayout = {
      size: ipoint(this.displaysEl.offsetWidth, this.displaysEl.offsetHeight)
    };
    this.refreshDisplayPositions();
    this.refreshDisplays();
  }

  setDisplay (display) {
    if (this.display) {
      this.display.hideCursor();
    }
    this.display = display;
    this.display.showCursor();
  }

  updateGlobalBounds (globalBounds) {
    this.#globalBounds = globalBounds;
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
    this.subscription.add(viewport.resize.subscribe(this.onViewportRefresh.bind(this)));

    // Initialize Inputs
    this.#inputs = {
      keyboard: new InputKeyboard(this),
      mouse: new InputMouse(this)
    };
    Object.values(this.#inputs).forEach((input) => {
      input.register();
    });
  }

  reset () {
    this.canvas.clearStack();
    this.displays.value.forEach(display => display.reset());
  }

  destroy () {
    this.subscription.unsubscribe();
  }

  refreshDisplays () {
    this.displays.value.forEach((display) => {
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
    display = markRaw(display || new Display(this));
    this.displays.value.push(display);
    display.app = this;
    this.events.next(new Event('addDisplay', display, this));
    this.canvas.render();
    return display;
  }

  clearDisplays () {
    this.displays.value.forEach((display) => {
      display.destroy();
      this.events.next(new Event('removeDisplay', display, this));
    });
    this.displays.value = [];
  }

  getDisplay (id) {
    return this.displays.value.find((display) => {
      if (display.id === id) {
        return display;
      }
      return false;
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

  get paletteSteps () {
    return this.colorSelect.paletteSteps;
  }

  set paletteSteps (value) {
    this.colorSelect.paletteSteps = value;
  }

  refreshDisplayPositions () {
    const width = this.displaysLayout.size.x;
    const height = this.displaysLayout.size.y;

    let positions = [
      [
        [
          1, 1
        ]
      ], [
        [
          0.5, 1
        ], [
          0.5, 1
        ]
      ], [
        [
          1, 0.5
        ], [
          1, 0.5
        ]
      ], [
        [
          1, 0.5
        ], [
          0.5, 0.5
        ], [
          0.5, 0.5
        ]
      ], [
        [
          0.5, 0.5
        ], [
          0.5, 0.5
        ], [
          1, 0.5
        ]
      ], [
        [
          0.5, 0.5
        ], [
          0.5, 0.5
        ], [
          0.5, 0.5
        ], [
          0.5, 0.5
        ]
      ]
    ].filter((position) => {
      if (position.length === this.displays.value.length) {
        return position;
      }
      return false;
    });
    positions = positions[0];
    this.displays.value.forEach((display, i) => {
      display.setSize(point(
        Math.floor(width * positions[Number(i)][0]),
        Math.floor(height * positions[Number(i)][1])
      ));
      // border
      if (positions[Number(i)][0] < 1) {
        // display.size.x--;
      }
      if (positions[Number(i)][1] < 1) {
        // display.size.y--;
      }
    });
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
