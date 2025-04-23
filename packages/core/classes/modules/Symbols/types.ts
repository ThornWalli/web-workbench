import type Symbols from '.';

declare module '../../../classes/Core' {
  interface CoreModules {
    symbols: Symbols;
  }
}
