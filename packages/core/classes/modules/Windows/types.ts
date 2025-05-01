import type Windows from '.';

declare module '../../../classes/Core' {
  interface CoreModules {
    windows: Windows;
  }
}
