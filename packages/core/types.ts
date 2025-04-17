import type Windows from './classes/modules/Windows';

declare module './classes/Core' {
  interface Core {
    modules: {
      windows: Windows;
    };
  }
}
