export interface WebPaintingThemeColors {
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
    webPainting?: WebPaintingThemeColors;
  }
}
