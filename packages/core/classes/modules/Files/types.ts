import type Files from '.';

declare module '../../../classes/Core' {
  interface CoreModules {
    files: Files;
  }
}
