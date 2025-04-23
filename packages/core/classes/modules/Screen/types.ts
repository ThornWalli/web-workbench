import type Screen from '.';

declare module '../../../classes/Core' {
  interface CoreModules {
    screen: Screen;
  }
}
