import type Parser from '.';

declare module '../../classes/Core' {
  interface CoreModules {
    parser: Parser;
  }
}
