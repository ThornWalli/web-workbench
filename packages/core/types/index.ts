import type { IPoint } from '@js-basics/vector';

import type Windows from '../classes/modules/Windows';

export interface Layout {
  position: IPoint;
  size: IPoint;
}

declare module '../classes/Core' {
  interface Core {
    modules: {
      windows: Windows;
    };
  }
}
