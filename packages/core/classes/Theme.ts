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
  colors: ColorsOptions;
  filter: string;
}

export function getColorsFromOptions(options: ColorsOptions): string[] {
  return [
    options.layout.primary,
    options.layout.secondary,
    options.layout.tertiary,
    options.layout.quaternary
  ];
}

export function getColorsOptions(colors: string[]): ColorsOptions {
  return {
    layout: {
      primary: colors[0],
      secondary: colors[1],
      tertiary: colors[2],
      quaternary: colors[3],
      invert: {
        primary: colors[1],
        secondary: colors[0],
        tertiary: colors[3],
        quaternary: colors[2]
      }
    },
    content: {
      primary: colors[0],
      secondary: colors[1],
      tertiary: colors[2],
      quaternary: colors[3],
      invert: {
        primary: colors[1],
        secondary: colors[0],
        tertiary: colors[3],
        quaternary: colors[2]
      }
    }
  };
}

// // ['#FFF', '#000', '#FFAA55', '#0055AA']

// // ['#0055AA', '#FFF', '#000', '#FFAA55']

export const PALETTE_THEMES: Record<THEMES, PaletteThemeDescription> = {
  [THEMES.DEFAULT]: {
    name: 'Theme Default',
    colors: getColorsOptions(['#0055AA', '#FFFFFF', '#000000', '#FFAA55']),
    filter: 'invert(100%)'
  },
  [THEMES.THEME_1]: {
    name: 'Theme 1', // ['#000000', '#FFFFFF', '#4466aa', '#919191']
    colors: getColorsOptions(['#919191', '#000000', '#ffffff', '#4466aa']),
    filter: 'invert(100%)'
  },
  [THEMES.THEME_2]: {
    name: 'Theme 2', // ['#FFFFFF', '#000000', '#dd99aa', '#8080a0']
    colors: getColorsOptions(['#8080a0', '#FFFFFF', '#000000', '#dd99aa']),
    filter: 'invert(100%)'
  },
  [THEMES.THEME_3]: {
    name: 'Theme 3', // ['#FFFFFF', '#000000', '#a8a0a0', '#406080']
    colors: getColorsOptions(['#406080', '#FFFFFF', '#000000', '#a8a0a0']),
    filter: 'invert(100%)'
  },
  [THEMES.THEME_4]: {
    name: 'Theme 4', // ['#FFFFFF', '#50473f', '#a08070', '#b0a090']
    colors: getColorsOptions(['#b0a090', '#FFFFFF', '#50473f', '#a08070']),
    filter: 'invert(100%)'
  },
  [THEMES.THEME_AMBER]: {
    name: 'Theme Amber', // ['#FFB000', '#805800', '#805800', '#000000']
    colors: getColorsOptions(['#000000', '#FFB000', '#805800', '#805800']),
    filter: 'brightness(50%)'
  },
  [THEMES.THEME_GREEN]: {
    name: 'Theme Green', // ['#00f900', '#008f11', '#00Bb00', '#000000']
    colors: getColorsOptions(['#000000', '#00f900', '#008f11', '#00Bb00']),
    filter: 'brightness(50%)'
  },
  [THEMES.THEME_RED]: {
    name: 'Theme Red', // ['#ee0000', '#660000', '#990000', '#330000']
    colors: getColorsOptions(['#330000', '#ee0000', '#660000', '#990000']),
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
export interface ColorsOptions {
  layout: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
    invert: {
      primary: string;
      secondary: string;
      tertiary: string;
      quaternary: string;
    };
  };
  content: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
    invert: {
      primary: string;
      secondary: string;
      tertiary: string;
      quaternary: string;
    };
  };
}

const defaultColors: ColorsOptions = {
  layout: {
    primary: '#0055AA',
    secondary: '#FFFFFF',
    tertiary: '#000000',
    quaternary: '#FFAA55',
    invert: {
      primary: '#FFFFFF',
      secondary: '#0055AA',
      tertiary: '#FFAA55',
      quaternary: '#000000'
    }
  },
  content: {
    primary: '#0055AA',
    secondary: '#FFFFFF',
    tertiary: '#000000',
    quaternary: '#FFAA55',
    invert: {
      primary: '#000000',
      secondary: '#FFAA55',
      tertiary: '#0055AA',
      quaternary: '#FFFFFF'
    }
  }
};
// ['#FFF', '#000', '#FFAA55', '#0055AA']
export function getDefaultThemeColors(
  colors = defaultColors
): ThemeDescription {
  return {
    disks: {},
    boot: {
      sequence_error: '#000',
      sequence_ready: colors.layout.primary,
      sequence_no_disk: '#fff',
      sequence_0: '#000',
      sequence_1: '#ccc',
      sequence_2: '#fff',
      sequence_3: colors.layout.primary
    },

    symbol: {
      primary: colors.layout.secondary,
      secondary: colors.layout.tertiary,
      tertiary: colors.layout.quaternary,
      quaternary: colors.layout.primary
    },

    screen: {
      background: colors.layout.primary
    },

    header: {
      background: colors.layout.invert.primary,
      coverBackground: colors.layout.invert.primary,
      coverTitle: colors.layout.invert.secondary,
      title: colors.layout.invert.secondary
    },

    windowHeader: {
      background: colors.layout.invert.primary,
      stripes: colors.layout.invert.secondary,
      title: colors.layout.invert.secondary,
      buttonBackground: colors.layout.invert.secondary,
      buttonPrimary: colors.layout.invert.primary,
      buttonSecondary: colors.layout.invert.quaternary,
      filled: {
        background: colors.layout.invert.primary,
        stripes: colors.layout.invert.primary,
        title: colors.layout.invert.secondary,
        buttonBackground: colors.layout.invert.secondary,
        buttonPrimary: colors.layout.invert.primary,
        buttonSecondary: colors.layout.invert.quaternary
      }
    },

    contextMenu: {
      border: colors.layout.invert.secondary
    },

    contextMenuItem: {
      background: colors.layout.invert.primary,
      label: colors.layout.invert.secondary,
      indicatorContext: colors.layout.invert.secondary,
      hotkey: colors.layout.invert.secondary
    },

    contextMenuSeparator: {
      background: colors.layout.primary
    },

    window: {
      text: colors.layout.secondary,
      background: colors.layout.primary,
      border: colors.layout.secondary,
      borderScaling: colors.layout.quaternary,
      helper__scaleBackground: colors.layout.secondary,
      helper__scaleIcon: colors.layout.primary,
      helper__scaleIconActive: colors.layout.tertiary,
      filled: {
        text: colors.layout.primary,
        background: colors.layout.secondary,
        border: colors.layout.secondary
      }
    },

    storageBar: {
      background: colors.layout.tertiary,
      border: colors.layout.secondary,
      sizeHelper: colors.layout.quaternary,
      icon: colors.layout.secondary
    },

    scrollContent: {
      scrollbarCorner: colors.layout.secondary,
      scrollbarSpacer: colors.layout.secondary,
      scrollbarBackground: colors.layout.primary,
      scrollbarHelperBackground: colors.layout.secondary,
      scrollbarHelper: colors.layout.primary,
      scrollbarHelperActive: colors.layout.tertiary,
      scrollbarRange: colors.layout.secondary,
      filled: {
        scrollbarCorner: colors.layout.secondary,
        scrollbarSpacer: colors.layout.primary,
        scrollbarBackground: colors.layout.secondary,
        scrollbarHelperBackground: colors.layout.secondary,
        scrollbarHelper: colors.layout.primary,
        scrollbarHelperActive: colors.layout.quaternary,
        scrollbarRange: colors.layout.secondary
      }
    },

    symbolWrapperItem: {
      text: colors.layout.secondary
    },

    button: {
      label: colors.layout.secondary,
      /* Primary Style */
      primary: {
        label: colors.layout.primary,
        background: colors.layout.secondary,
        border: colors.layout.secondary,
        outline: colors.layout.primary
      },
      /* Secondary Style */
      secondary: {
        label: colors.layout.secondary,
        background: colors.layout.primary,
        border: colors.layout.secondary
      },
      /* Dialog Style */
      dialog: {
        label: colors.layout.primary,
        background: colors.layout.secondary,
        border: colors.layout.quaternary,
        outline: colors.layout.primary
      },
      filled: {
        label: colors.layout.primary,
        /* Primary Style */
        primary: {
          label: colors.layout.secondary,
          background: colors.layout.primary,
          border: colors.layout.primary,
          outline: colors.layout.secondary
        },
        /* Secondary Style */
        secondary: {
          label: colors.layout.primary,
          background: colors.layout.secondary,
          border: colors.layout.secondary
        },
        /* Dialog Style */
        dialog: {
          label: colors.layout.secondary,
          background: colors.layout.primary,
          border: colors.layout.quaternary,
          outline: colors.layout.secondary
        }
      }
    },

    checkbox: {
      disabled: {
        icon: colors.layout.secondary,
        background: colors.layout.secondary
      },
      background: colors.layout.primary,
      icon: colors.layout.secondary,
      filled: {
        disabled: {
          icon: colors.layout.quaternary,
          background: colors.layout.quaternary
        },
        background: colors.layout.secondary,
        icon: colors.layout.tertiary
      }
    },

    checkboxGroupItem: {
      disabled: {
        icon: colors.layout.secondary,
        background: colors.layout.secondary
      },
      background: colors.layout.primary,
      checkbox: {
        icon: colors.layout.secondary
      },
      radio: {
        icon: colors.layout.secondary
      }
    },

    rangeSlider: {
      background: colors.layout.primary,
      border: colors.layout.secondary,
      thumbBackground: colors.layout.secondary,
      filled: {
        background: colors.layout.secondary,
        border: colors.layout.primary,
        thumbBackground: colors.layout.primary
      }
    },

    textfield: {
      text: colors.layout.secondary,
      background: colors.layout.primary,
      border: colors.layout.primary,
      outline: colors.layout.secondary,
      dialog: {
        text: colors.layout.primary,
        background: colors.layout.secondary,
        border: colors.layout.secondary,
        outline: colors.layout.primary
      },
      disabledReadonlyText: colors.layout.primary,
      disabledReadonlyBackground: colors.layout.secondary
    },

    textarea: {
      text: colors.layout.secondary,
      background: colors.layout.primary,
      border: colors.layout.primary,
      outline: colors.layout.secondary,
      resizeBackground: colors.layout.primary,
      resizeIcon: colors.layout.secondary,
      filled: {
        text: colors.layout.primary,
        background: colors.layout.secondary,
        border: colors.layout.secondary,
        outline: colors.layout.primary,
        resizeBackground: colors.layout.secondary,
        resizeIcon: colors.layout.primary
      }
    },

    dropdown: {
      disabled: {
        text: colors.layout.primary,
        background: colors.layout.secondary
      },
      text: colors.layout.secondary,
      background: colors.layout.primary,
      border: colors.layout.primary,
      outline: colors.layout.secondary,
      scrollbarPrimary: colors.layout.secondary,
      scrollbarSecondary: colors.layout.primary,
      expander: {
        icon: colors.layout.primary,
        border: colors.layout.primary,
        background: colors.layout.secondary
      },
      filled: {
        disabled: {
          text: colors.layout.secondary,
          background: colors.layout.primary
        },
        text: colors.layout.primary,
        background: colors.layout.secondary,
        border: colors.layout.secondary,
        outline: colors.layout.primary,
        scrollbarPrimary: colors.layout.primary,
        scrollbarSecondary: colors.layout.secondary,
        expander: {
          icon: colors.layout.secondary,
          border: colors.layout.secondary,
          background: colors.layout.primary
        }
      }
    },

    itemSelect: {
      border: colors.layout.secondary
    },

    itemSelectItem: {
      border: colors.layout.secondary,
      background: colors.layout.primary,
      disabledLabelText: colors.layout.secondary,
      disabledLabelbackground: colors.layout.tertiary
    },

    inputText: {
      selected: colors.layout.primary,
      pointer: colors.layout.quaternary
    },

    markdown: {
      typo: {
        selection: colors.layout.tertiary,
        headlinePrimary: colors.layout.secondary,
        headlineSecondary: colors.layout.quaternary,
        strong: colors.layout.quaternary,
        strongEm: colors.layout.secondary,
        link: colors.layout.quaternary,
        linkHover: colors.layout.secondary,
        del: colors.layout.tertiary,
        line: colors.layout.secondary,
        blockquoteBackground: colors.layout.quaternary,
        blockquoteText: colors.layout.tertiary,
        codeBackground: colors.layout.secondary,
        codeText: colors.layout.tertiary,
        codeSelection: colors.layout.quaternary,
        filled: {
          selection: colors.layout.tertiary,
          headlinePrimary: colors.layout.tertiary,
          headlineSecondary: colors.layout.tertiary,
          strong: colors.layout.quaternary,
          strongEm: colors.layout.secondary,
          link: colors.layout.quaternary,
          linkHover: colors.layout.tertiary,
          del: colors.layout.tertiary,
          line: colors.layout.quaternary,
          blockquoteBackground: colors.layout.quaternary,
          blockquoteText: colors.layout.tertiary,
          codeBackground: colors.layout.secondary,
          codeText: colors.layout.quaternary,
          codeSelection: colors.layout.tertiary
        }
      }
    },

    separator: {
      color: colors.layout.secondary,
      filled: {
        color: colors.layout.primary
      }
    },

    dialogContent: {
      backgroundPrimary: colors.layout.secondary,
      backgroundSecondary: colors.layout.secondary,
      text: colors.layout.primary
    },

    form: {
      fieldsetBorder: colors.layout.quaternary
    },

    console: {
      text: colors.layout.secondary,
      typo: {
        fieldsetBorder: colors.layout.quaternary,
        line: colors.layout.secondary,
        strong: colors.layout.quaternary,
        strongEm: colors.layout.secondary
      }
    },

    core: {
      text: colors.layout.secondary
    },

    workbench13: {
      calculator: {
        background: colors.layout.tertiary,
        button: {
          text: colors.layout.secondary,
          border: colors.layout.secondary
        },
        result: {
          border: colors.layout.secondary
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
