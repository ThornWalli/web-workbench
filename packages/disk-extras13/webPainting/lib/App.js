import { Subscription, Subject } from 'rxjs';
import { ipoint, point } from '@js-basics/vector';
import { markRaw } from 'vue';
import Event from '@web-workbench/core/classes/Event';
import viewport from '@web-workbench/core/services/viewport';
import Canvas from './Canvas';
import Color from './Color';
import InputKeyboard from './input/Keyboard';
import InputMouse from './input/Mouse';

import { getToolByIndex } from './Tool';
import { getBrushByIndex } from './Brush';
import Display from './Display';

export const DISPLAY_SPLIT_VALUES = {
  FULL: 0,
  HALF: 1,
  THIRD: 2,
  QUARTER: 3
};

export default class App {
  subscription = new Subscription();
  events = new Subject();
  globalBounds;

  fsItem;

  options = {
    size: { width: 300, height: 200 },
    display: {
      foreground: '#FFFFFF',
      background: '#000000'
    }
  };

  density = 1;

  displaySplit = DISPLAY_SPLIT_VALUES.FULL;
  displays = [];
  displaysEl;
  displaysLayout = {
    size: ipoint()
  };

  display;

  canvas;

  inputs;

  brush;
  brushSelect = {
    size: 1,
    index: 0
  };

  colorSelect = {
    primaryColor: new Color(Color.COLOR_BLACK),
    secondaryColor: new Color(Color.COLOR_WHITE),
    paletteSteps: new Color(2, 1, 1)
  };

  setColorSelect(colorSelect) {
    this.colorSelect = {
      ...this.colorSelect,
      ...colorSelect
    };
  }
  setBrushSelect(brushSelect) {
    this.brushSelect = {
      ...this.brushSelect,
      ...brushSelect
    };
  }
  setToolSelect(toolSelect) {
    this.toolSelect = {
      ...this.toolSelect,
      ...toolSelect
    };
  }

  tool;
  toolSelect = {
    value: '',
    index: 1,
    filled: false
  };

  cursorCanvas = null;

  setDisplaysElement(displaysEl) {
    this.displaysEl = displaysEl;
  }

  refresh() {
    this.displaysLayout = {
      size: ipoint(this.displaysEl.offsetWidth, this.displaysEl.offsetHeight)
    };
    this.refreshDisplayPositions();
    this.refreshDisplays();
  }

  setDisplay(display) {
    if (this.display) {
      this.display.hideCursor();
    }
    this.display = display;
    this.display.showCursor();
  }

  updateGlobalBounds(globalBounds) {
    this.globalBounds = globalBounds;
  }

  constructor(globalBounds) {
    // Variables

    this.globalBounds = globalBounds;
    this.canvas = new Canvas(this);

    // Properties

    this.setBrush(this.brushSelect);
    this.setTool(this.toolSelect);

    // Events
    this.subscription.add(
      viewport.resize.subscribe(this.onViewportRefresh.bind(this))
    );

    // Initialize Inputs
    this.inputs = {
      keyboard: new InputKeyboard(this),
      mouse: new InputMouse(this)
    };
    Object.values(this.inputs).forEach(input => {
      input.register();
    });
  }

  reset() {
    this.canvas.clearStack();
    this.displays.forEach(display => display.reset());
  }

  destroy() {
    this.subscription.unsubscribe();
  }

  refreshDisplays() {
    this.displays.forEach(display => {
      display.refresh();
    });
  }

  onViewportRefresh() {
    this.refreshDisplays();
  }

  /**
   * @param {Display}
   */
  addDisplay(display) {
    display = markRaw(display || new Display(this));
    this.displays.push(display);
    display.app = this;
    this.events.next(
      new Event({ name: 'addDisplay', value: display, scope: this })
    );
    this.canvas.render();
    return display;
  }

  clearDisplays() {
    this.displays.forEach(display => {
      display.destroy();
      this.events.next(
        new Event({ name: 'removeDisplay', value: display, scope: this })
      );
    });
    this.displays = [];
  }

  getDisplay(id) {
    return this.displays.find(display => {
      if (display.id === id) {
        return display;
      }
      return false;
    });
  }

  /**
   * @param  {Number} index
   */
  setBrush({ index, size }) {
    this.brush = new (getBrushByIndex(index))({
      app: this,
      size
    });
    if (this.tool) {
      this.tool.brush = this.brush;
    }
    this.events.next(
      new Event({ name: 'change:brush', value: this.brush, scope: this })
    );
  }

  setBrushSize(size) {
    this.brush.size = size;
  }

  /**
   * @param  {Number} index
   */
  setTool({ index }) {
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
    this.events.next(
      new Event({ name: 'change:tool', value: this.tool, scope: this })
    );
    // }
  }

  get paletteSteps() {
    return this.colorSelect.paletteSteps;
  }

  set paletteSteps(value) {
    this.colorSelect.paletteSteps = value;
  }

  refreshDisplayPositions() {
    const width = this.displaysLayout.size.x;
    const height = this.displaysLayout.size.y;

    let positions = [
      [[1, 1]],
      [
        [0.5, 1],
        [0.5, 1]
      ],
      [
        [1, 0.5],
        [1, 0.5]
      ],
      [
        [1, 0.5],
        [0.5, 0.5],
        [0.5, 0.5]
      ],
      [
        [0.5, 0.5],
        [0.5, 0.5],
        [1, 0.5]
      ],
      [
        [0.5, 0.5],
        [0.5, 0.5],
        [0.5, 0.5],
        [0.5, 0.5]
      ]
    ].filter(position => {
      if (position.length === this.displays.length) {
        return position;
      }
      return false;
    });
    positions = positions[0];
    this.displays.forEach((display, i) => {
      display.setSize(
        point(
          Math.floor(width * positions[Number(i)][0]),
          Math.floor(height * positions[Number(i)][1])
        )
      );
      // border
      if (positions[Number(i)][0] < 1) {
        // display.size.x--;
      }
      if (positions[Number(i)][1] < 1) {
        // display.size.y--;
      }
    });
  }
}
