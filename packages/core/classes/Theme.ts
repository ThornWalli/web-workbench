import { kebabCase } from 'change-case';

export enum THEMES {
  DEFAULT = 'default',
  THEME_1 = 'theme1',
  THEME_2 = 'theme2',
  THEME_3 = 'theme3',
  THEME_4 = 'theme4',
  THEME_AMBER = 'themeAmber',
  THEME_GREEN = 'themeGreen',
  THEME_RED = 'themeRed'
}
export const DEFAULT_PALETTE_THEME = THEMES.DEFAULT;

export interface PaletteThemeDescription {
  name: string;
  colors: string[];
  filter: string;
}

export const PALETTE_THEMES: Record<THEMES, PaletteThemeDescription> = {
  [THEMES.DEFAULT]: {
    name: 'Theme Default',
    colors: ['#FFFFFF', '#000', '#FFAA55', '#0055AA'],
    filter: 'invert(100%)'
  },
  [THEMES.THEME_1]: {
    name: 'Theme 1',
    colors: ['#000000', '#FFFFFF', '#4466aa', '#919191'],
    filter: 'invert(100%)'
  },
  [THEMES.THEME_2]: {
    name: 'Theme 2',
    colors: ['#FFFFFF', '#000000', '#dd99aa', '#8080a0'],
    filter: 'invert(100%)'
  },
  [THEMES.THEME_3]: {
    name: 'Theme 3',
    colors: ['#FFFFFF', '#000000', '#a8a0a0', '#406080'],
    filter: 'invert(100%)'
  },
  [THEMES.THEME_4]: {
    name: 'Theme 4',
    colors: ['#FFFFFF', '#50473f', '#a08070', '#b0a090'],
    filter: 'invert(100%)'
  },
  [THEMES.THEME_AMBER]: {
    name: 'Theme Amber',
    colors: ['#FFB000', '#805800', '#805800', '#000000'],
    filter: 'brightness(50%)'
  },
  [THEMES.THEME_GREEN]: {
    name: 'Theme Green',
    colors: ['#00f900', '#008f11', '#00Bb00', '#000000'],
    filter: 'brightness(50%)'
  },
  [THEMES.THEME_RED]: {
    name: 'Theme Red',
    colors: ['#ee0000', '#660000', '#990000', '#330000'],
    filter: 'brightness(50%)'
  }
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DiskThemeDescription {}

export interface ThemeDescription {
  disks: DiskThemeDescription;

  boot: {
    sequence_error: string;
    sequence_ready: string;
    sequence_no_disk: string;
    sequence_0: string;
    sequence_1: string;
    sequence_2: string;
    sequence_3: string;
  };

  symbol: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
  };

  screen: {
    background: string;
  };

  header: {
    background: string;
    coverBackground: string;
    coverTitle: string;
    title: string;
  };

  windowHeader: {
    background: string;
    stripes: string;
    title: string;
    buttonBackground: string;
    buttonPrimary: string;
    buttonSecondary: string;
    filled: {
      background: string;
      stripes: string;
      title: string;
      buttonBackground: string;
      buttonPrimary: string;
      buttonSecondary: string;
    };
  };

  contextMenu: {
    border: string;
  };

  contextMenuItem: {
    background: string;
    label: string;
    indicatorContext: string;
    hotkey: string;
  };

  contextMenuSeparator: {
    background: string;
  };

  window: {
    text: string;
    background: string;
    border: string;
    borderScaling: string;
    helper__scaleBackground: string;
    helper__scaleIcon: string;
    helper__scaleIconActive: string;
    filled: {
      text: string;
      background: string;
      border: string;
    };
  };

  storageBar: {
    background: string;
    border: string;
    sizeHelper: string;
    icon: string;
  };

  scrollContent: {
    scrollbarCorner: string;
    scrollbarSpacer: string;
    scrollbarBackground: string;
    scrollbarHelperBackground: string;
    scrollbarHelper: string;
    scrollbarHelperActive: string;
    scrollbarRange: string;
    filled: {
      scrollbarCorner: string;
      scrollbarSpacer: string;
      scrollbarBackground: string;
      scrollbarHelperBackground: string;
      scrollbarHelper: string;
      scrollbarHelperActive: string;
      scrollbarRange: string;
    };
  };

  symbolWrapperItem: {
    text: string;
  };

  button: {
    label: string;
    /* Primary Style */
    primary: {
      label: string;
      background: string;
      border: string;
      outline: string;
    };
    /* Secondary Style */
    secondary: {
      label: string;
      background: string;
      border: string;
    };
    /* Dialog Style */
    dialog: {
      label: string;
      background: string;
      border: string;
      outline: string;
    };
    filled: {
      label: string;
      /* Primary Style */
      primary: {
        label: string;
        background: string;
        border: string;
        outline: string;
      };
      /* Secondary Style */
      secondary: {
        label: string;
        background: string;
        border: string;
      };
      /* Dialog Style */
      dialog: {
        label: string;
        background: string;
        border: string;
        outline: string;
      };
    };
  };

  checkbox: {
    disabled: {
      icon: string;
      background: string;
    };
    background: string;
    icon: string;
    filled: {
      disabled: {
        icon: string;
        background: string;
      };
      background: string;
      icon: string;
    };
  };

  checkboxGroupItem: {
    disabled: {
      icon: string;
      background: string;
    };
    background: string;
    checkbox: {
      icon: string;
    };
    radio: {
      icon: string;
    };
  };

  rangeSlider: {
    background: string;
    border: string;
    thumbBackground: string;
    filled: {
      background: string;
      border: string;
      thumbBackground: string;
    };
  };

  textfield: {
    text: string;
    background: string;
    border: string;
    outline: string;
    dialog: {
      text: string;
      background: string;
      border: string;
      outline: string;
    };
    disabledReadonlyText: string;
    disabledReadonlyBackground: string;
  };

  textarea: {
    text: string;
    background: string;
    border: string;
    outline: string;
    resizeBackground: string;
    resizeIcon: string;
    filled: {
      text: string;
      background: string;
      border: string;
      outline: string;
      resizeBackground: string;
      resizeIcon: string;
    };
  };

  dropdown: {
    disabled: {
      text: string;
      background: string;
    };
    text: string;
    background: string;
    border: string;
    outline: string;
    scrollbarPrimary: string;
    scrollbarSecondary: string;
    expander: {
      icon: string;
      border: string;
      background: string;
    };
    filled: {
      disabled: {
        text: string;
        background: string;
      };
      text: string;
      background: string;
      border: string;
      outline: string;
      scrollbarPrimary: string;
      scrollbarSecondary: string;
      expander: {
        icon: string;
        border: string;
        background: string;
      };
    };
  };

  itemSelect: {
    border: string;
  };

  itemSelectItem: {
    border: string;
    background: string;
    disabledLabelText: string;
    disabledLabelbackground: string;
  };

  inputText: {
    selected: string;
    pointer: string;
  };

  markdown: {
    typo: {
      selection: string;
      headlinePrimary: string;
      headlineSecondary: string;
      strong: string;
      strongEm: string;
      link: string;
      linkHover: string;
      del: string;
      line: string;
      blockquoteBackground: string;
      blockquoteText: string;
      codeBackground: string;
      codeText: string;
      codeSelection: string;
      filled: {
        selection: string;
        headlinePrimary: string;
        headlineSecondary: string;
        strong: string;
        strongEm: string;
        link: string;
        linkHover: string;
        del: string;
        line: string;
        blockquoteBackground: string;
        blockquoteText: string;
        codeBackground: string;
        codeText: string;
        codeSelection: string;
      };
    };
  };

  separator: {
    color: string;
    filled: {
      color: string;
    };
  };

  dialogContent: {
    backgroundPrimary: string;
    backgroundSecondary: string;
    text: string;
  };

  form: {
    fieldsetBorder: string;
  };

  console: {
    text: string;
    typo: {
      fieldsetBorder: string;
      line: string;
      strong: string;
      strongEm: string;
    };
  };

  core: {
    text: string;
  };

  workbench13: {
    calculator: {
      background: string;
      button: {
        text: string;
        border: string;
      };
      result: {
        border: string;
      };
    };
  };
}

// interface Colors {
//   background: {
//     primary: string;
//     secondary: string;
//     tertiary: string;
//     quaternary: string;
//   };
//   foreground: {
//     primary: string;
//     secondary: string;
//     tertiary: string;
//     quaternary: string;
//   };
// }

export function getDefaultThemeColors(
  colors = ['#FFF', '#000', '#FFAA55', '#0055AA']
): ThemeDescription {
  return {
    disks: {},
    boot: {
      sequence_error: '#000',
      sequence_ready: colors[3],
      sequence_no_disk: '#fff',
      sequence_0: '#000',
      sequence_1: '#ccc',
      sequence_2: '#fff',
      sequence_3: colors[3]
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
      buttonSecondary: colors[1],
      filled: {
        background: colors[0],
        stripes: colors[0],
        title: colors[3],
        buttonBackground: colors[3],
        buttonPrimary: colors[0],
        buttonSecondary: colors[1]
      }
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
      helper__scaleIconActive: colors[1],
      filled: {
        text: colors[3],
        background: colors[0],
        border: colors[0]
      }
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
      scrollbarRange: colors[0],
      filled: {
        scrollbarCorner: colors[0],
        scrollbarSpacer: colors[3],
        scrollbarBackground: colors[0],
        scrollbarHelperBackground: colors[0],
        scrollbarHelper: colors[3],
        scrollbarHelperActive: colors[2],
        scrollbarRange: colors[0]
      }
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
      },
      filled: {
        label: colors[3],
        /* Primary Style */
        primary: {
          label: colors[0],
          background: colors[3],
          border: colors[3],
          outline: colors[0]
        },
        /* Secondary Style */
        secondary: {
          label: colors[3],
          background: colors[0],
          border: colors[0]
        },
        /* Dialog Style */
        dialog: {
          label: colors[0],
          background: colors[3],
          border: colors[2],
          outline: colors[0]
        }
      }
    },

    checkbox: {
      disabled: {
        icon: colors[0],
        background: colors[0]
      },
      background: colors[3],
      icon: colors[0],
      filled: {
        disabled: {
          icon: colors[2],
          background: colors[2]
        },
        background: colors[0],
        icon: colors[1]
      }
    },

    checkboxGroupItem: {
      disabled: {
        icon: colors[0],
        background: colors[0]
      },
      background: colors[3],
      checkbox: {
        icon: colors[0]
      },
      radio: {
        icon: colors[0]
      }
    },

    rangeSlider: {
      background: colors[3],
      border: colors[0],
      thumbBackground: colors[0],
      filled: {
        background: colors[0],
        border: colors[3],
        thumbBackground: colors[3]
      }
    },

    textfield: {
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
      resizeIcon: colors[0],
      filled: {
        text: colors[3],
        background: colors[0],
        border: colors[0],
        outline: colors[3],
        resizeBackground: colors[0],
        resizeIcon: colors[3]
      }
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
      },
      filled: {
        disabled: {
          text: colors[0],
          background: colors[3]
        },
        text: colors[3],
        background: colors[0],
        border: colors[0],
        outline: colors[3],
        scrollbarPrimary: colors[3],
        scrollbarSecondary: colors[0],
        expander: {
          icon: colors[0],
          border: colors[0],
          background: colors[3]
        }
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
        codeSelection: colors[2],
        filled: {
          selection: colors[1],
          headlinePrimary: colors[1],
          headlineSecondary: colors[1],
          strong: colors[2],
          strongEm: colors[0],
          link: colors[2],
          linkHover: colors[1],
          del: colors[1],
          line: colors[2],
          blockquoteBackground: colors[2],
          blockquoteText: colors[1],
          codeBackground: colors[0],
          codeText: colors[2],
          codeSelection: colors[1]
        }
      }
    },

    separator: {
      color: colors[0],
      filled: {
        color: colors[3]
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

function getDefaultFilters(filter = 'invert(100%)') {
  return {
    default: filter
  };
}

export default class Theme {
  name = 'wb13';
  colors?: Partial<ThemeDescription> = {};
  filters?: { [key: string]: string } = {};

  constructor(
    name?: string,
    options?: {
      colors?: Partial<ThemeDescription>;
      filters?: { [key: string]: string };
    }
  ) {
    const { colors, filters } = Object.assign(
      { colors: {}, filters: {} },
      options
    );
    this.name = name || this.name;
    this.colors = Object.assign(getDefaultThemeColors(), colors);
    this.filters = Object.assign(getDefaultFilters(), filters);
  }

  toCSSVars() {
    return Object.assign(
      {},
      generateVars(
        Object.assign({
          color: this.colors,
          filter: this.filters
        })
      )
    );
  }

  extend(
    name: string,
    options: Partial<{
      colors?: Partial<ThemeDescription>;
      filters?: { [key: string]: string };
    }> = {}
  ) {
    const colors = Object.assign({}, this.colors, options.colors || {});
    const filters = Object.assign({}, this.filters, options.filters);
    return new Theme(name, { colors, filters });
  }
}

const VAR_SEPARATOR = '-';
function generateVars(
  vars: { [key: string]: string } | string,
  name = '',
  result: { [key: string]: string } = {}
) {
  if (typeof vars === 'object') {
    Object.keys(vars).map(key => {
      const value = vars[String(key)];
      return generateVars(
        value,
        (name ? name + VAR_SEPARATOR : '') + key,
        result
      );
    });
    return result;
  } else {
    result[`--${kebabCase(name)}`] = vars;
    return result;
  }
}

// #FFF, #000, #FFAA55, #0055AA

// #000, #FFF, #4d6fa2, #919191

// #FFF, #000, #d090a0, #8080a0

// #FFF, #000, #a8a0b0, #406080

// #FFF, #50473f, #a08070, #b0a090

export class PaletteTheme extends Theme {
  constructor(name: string, options: PaletteThemeDescription) {
    const { colors, filter } = Object.assign(
      {
        colors: null,
        filter: null
      },
      options
    );
    super(name, {
      colors: getDefaultThemeColors(colors),
      filters: getDefaultFilters(filter)
    });
  }
}
