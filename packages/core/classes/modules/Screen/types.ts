import type Screen from '.';

declare module '../../../classes/Core' {
  interface CoreModules {
    screen: Screen;
  }
}

declare module '../../../classes/Module' {
  interface IModule {
    contentEl?: HTMLElement;
  }
}
