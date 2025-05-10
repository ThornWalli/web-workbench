import type McText from '../../components/Text.vue';

export enum CONSOLE_ALIGN {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center'
}

export interface ConsoleLine {
  ok?: boolean;
  align?: CONSOLE_ALIGN;
  block?: boolean;
  color?: string;
  content?: string;
  class?: string;
  key?: string;
  group?: string;
  break?: boolean;
  spacer?: boolean;
  background?: boolean;
  underline?: boolean;
}

export interface ConsoleGroup {
  key?: string;
  group: string;
  lines: ConsoleGroupLines;
}

export type ConsoleSubGroupLines = (ConsoleLine | ConsoleLine[])[];

export type ConsoleGroupLines = (
  | ConsoleLine
  | ConsoleLine[]
  | ConsoleLine[][]
)[];

export interface ParsedConsoleLine {
  component: string | typeof McText;
  data: {
    key: string;
    content?: string;
    color?: string;
    class?: string;
    background?: boolean;
    sibling?: boolean;
    embed?: boolean;
    lines?: ParsedConsoleLine[];
    spacer?: boolean;
  };
}

export interface Result {
  ratio: number;
  costsResult: {
    [key: string]: number;
  };
  productionResult: {
    [key: string]: number;
  };
  costsResultRatio: {
    [key: string]: number;
  };
  totalCosts: {
    [key: string]: number;
  };
  status: {
    costs: boolean;
    full: boolean;
  };
  groups: ConsoleGroup[];
}
