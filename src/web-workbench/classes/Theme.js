
export const DEFAULT_PALETTE_THEME = 'default';
export const PALETTE_THEMES = {
  default: {
    title: 'Theme Default',
    colors: [
      '#FFFFFF', '#000', '#FFAA52', '#0055AA'
    ],
    filter: 'invert(100%)'
  },
  theme1: {
    title: 'Theme 1',
    colors: [
      '#000000', '#FFFFFF', '#4466aa', '#919191'
    ],
    filter: 'invert(100%)'
  },
  theme2: {
    title: 'Theme 2',
    colors: [
      '#FFFFFF', '#000000', '#dd99aa', '#8080a0'
    ],
    filter: 'invert(100%)'
  },
  theme3: {
    title: 'Theme 3',
    colors: [
      '#FFFFFF', '#000000', '#a8a0a0', '#406080'
    ],
    filter: 'invert(100%)'
  },
  theme4: {
    title: 'Theme 4',
    colors: [
      '#FFFFFF', '#50473f', '#a08070', '#b0a090'
    ],
    filter: 'invert(100%)'
  },
  themeGreen: {
    title: 'Theme Green',
    colors: [
      '#00f900', '#008f11', '#00Bb00', '#000000'
    ],
    filter: 'brightness(50%)'
  },
  themeRed: {
    title: 'Theme Red',
    colors: [
      '#ee0000', '#660000', '#990000', '#330000'
    ],
    filter: 'brightness(50%)'
  }

};

function getDefaultColors (colors) {
  colors = colors || [
    '#FFF',
    '#000',
    '#FFAA52',
    '#0055AA'
  ];

  return {

    boot: {
      sequence_0: '#000',
      sequence_1: '#000',
      sequence_2: '#ccc',
      sequence_3: '#fff',
      sequence_4: colors[3]
    },

    symbol: {
      primary: colors[0],
      secondary: colors[1],
      tertiary: colors[2],
      quaternary: colors[3]
    },

    screen: {
      background: colors[3]
    },

    header: {
      background: colors[0],
      coverBackground: colors[0],
      coverTitle: colors[3],
      title: colors[3]
    },

    windowHeader: {
      background: colors[0],
      stripes: colors[3],
      title: colors[3],
      buttonBackground: colors[3],
      buttonPrimary: colors[0],
      buttonSecondary: colors[1]
    },

    contextMenu: {
      border: colors[3]
    },

    contextMenuItem: {
      background: colors[0],
      label: colors[3],
      indicatorContext: colors[3],
      hotkey: colors[3]
    },

    contextMenuSeparator: {
      background: colors[3]
    },

    window: {
      text: colors[0],
      background: colors[3],
      border: colors[0],
      borderScaling: colors[2],
      helper__scaleBackground: colors[0],
      helper__scaleIcon: colors[3],
      helper__scaleIconActive: colors[1]
    },

    storageBar: {
      background: colors[1],
      border: colors[0],
      sizeHelper: colors[2],
      icon: colors[0]
    },

    scrollContent: {
      scrollbarCorner: colors[0],
      scrollbarSpacer: colors[0],
      scrollbarBackground: colors[3],
      scrollbarHelperBackground: colors[0],
      scrollbarHelper: colors[3],
      scrollbarHelperActive: colors[1],
      scrollbarRange: colors[0]
    },

    symbolWrapperItem: {
      text: colors[0]
    },

    button: {
      label: colors[0],
      /* Primary Style */
      primary: {
        label: colors[3],
        background: colors[0],
        border: colors[0],
        outline: colors[3]
      },
      /* Secondary Style */
      secondary: {
        label: colors[0],
        background: colors[3],
        border: colors[0]
      },
      /* Dialog Style */
      dialog: {
        label: colors[3],
        background: colors[0],
        border: colors[2],
        outline: colors[3]
      }
    },

    checkboxGroupItem: {
      disabled: { icon: colors[0] },
      background: colors[3],
      checkbox: {
        icon: colors[0]
      },
      radio: {
        icon: colors[0]
      }
    },

    textbox: {
      text: colors[0],
      background: colors[3],
      border: colors[3],
      outline: colors[0],
      dialog: {
        text: colors[3],
        background: colors[0],
        border: colors[0],
        outline: colors[3]
      },
      disabledReadonlyText: colors[3],
      disabledReadonlyBackground: colors[0]
    },

    textarea: {
      text: colors[0],
      background: colors[3],
      border: colors[3],
      outline: colors[0],
      resizeBackground: colors[3],
      resizeIcon: colors[0]
    },

    dropdown: {
      disabled: {
        text: colors[3],
        background: colors[0]
      },
      text: colors[0],
      background: colors[3],
      border: colors[3],
      outline: colors[0],
      scrollbarPrimary: colors[0],
      scrollbarSecondary: colors[3],
      expander: {
        icon: colors[3],
        border: colors[3],
        background: colors[0]
      }
    },

    itemSelect: {
      border: colors[0]
    },

    itemSelectItem: {
      border: colors[0],
      background: colors[3],
      disabledLabelText: colors[0],
      disabledLabelbackground: colors[1]
    },

    inputText: {
      selected: colors[3],
      pointer: colors[2]
    },

    markdown: {
      typo: {
        selection: colors[1],
        headlinePrimary: colors[0],
        headlineSecondary: colors[2],
        strong: colors[2],
        strongEm: colors[0],
        link: colors[2],
        linkHover: colors[0],
        del: colors[1],
        line: colors[0],
        blockquoteBackground: colors[2],
        blockquoteText: colors[1],
        codeBackground: colors[0],
        codeText: colors[1],
        codeSelection: colors[2]
      }
    },

    dialogContent: {
      backgroundPrimary: colors[0],
      backgroundSecondary: colors[0],
      text: colors[3]
    },

    form: {
      fieldsetBorder: colors[2]
    },

    console: {
      text: colors[0],
      typo: {
        fieldsetBorder: colors[2],
        line: colors[0],
        strong: colors[2],
        strongEm: colors[0]
      }
    },

    core: {
      text: colors[0]
    },

    workbench13: {
      calculator: {
        background: colors[1],
        button: {
          text: colors[0],
          border: colors[0]
        },
        result: {
          border: colors[0]
        }
      }
    }

  };
}

function getDefaultFilters (filter) {
  return {
    default: filter || 'invert(100%)'
  };
}

export class Theme {
  name = 'wb13';

  constructor (name, options) {
    const { colors, filters } = Object.assign({ colors: {}, filters: {} }, options);
    this.name = name || this.name;
    this.colors = Object.assign(getDefaultColors(), colors);
    this.filters = Object.assign(getDefaultFilters(), filters);
  }

  toCSSVars () {
    return Object.assign({}, generateVars(Object.assign({
      color: this.colors, filter: this.filters
    })), generateVars());
  }
}

function generateVars (colors, name = '', result = {}) {
  if (typeof colors === 'object') {
    Object.keys(colors).map((key) => {
      return generateVars(colors[String(key)], (name ? name + '__' : '') + key, result);
    });
    return result;
  } else {
    result[`--${name}`] = colors;
    return result;
  }
}

// #FFF, #000, #FFAA52, #0055AA

// #000, #FFF, #4d6fa2, #919191

// #FFF, #000, #d090a0, #8080a0

// #FFF, #000, #a8a0b0, #406080

// #FFF, #50473f, #a08070, #b0a090

export class PaletteTheme extends Theme {
  constructor (name, options) {
    const { colors, filter } = Object.assign({
      colors: null, filter: null
    }, options);
    super(name, {
      colors: getDefaultColors(colors), filters: getDefaultFilters(filter)
    });
  }
}
