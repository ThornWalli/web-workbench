export interface WebPaintThemeColors {
  originSelect: {
    background: string;
    foreground: string;
    selected: {
      background: string;
      foreground: string;
    };
  };

  aspectRatioPreview: {
    background: string;
    foreground: string;
    filled: {
      background: string;
      foreground: string;
    };
  };

  colorSelect: {
    border: string;
    selcted: {
      border: string;
    };
    filled: {
      border: string;
      selected: {
        border: string;
      };
    };
  };

  iconButton: {
    background: string;
    foreground: string;
    hover: {
      background: string;
      foreground: string;
    };
    filled: {
      background: string;
      foreground: string;
      hover: {
        background: string;
        foreground: string;
      };
    };
  };

  sidebar: {
    background: {
      primary: string;
      secondary: string;
    };
    border: string;

    brushSelect: {
      background: string;
      item: {
        foreground: string;
        selected: {
          foreground: string;
        };
      };
    };

    toolSelect: {
      background: string;
      item: {
        background: string;
        foreground: string;
        selected: {
          background: string;
          foreground: string;
        };
      };
    };

    colorSelect: {
      background: string;
      item: {
        selected: {
          border: string;
        };
      };
    };
  };
}

declare module '@web-workbench/core/classes/Theme' {
  export interface DiskThemeDescription {
    webPaint?: WebPaintThemeColors;
  }
}
