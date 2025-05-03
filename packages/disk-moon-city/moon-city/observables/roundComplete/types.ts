export interface ConsoleLine {
  color: string;
  content: string;
  class?: string;
  key?: string;
  group?: string;
}

export interface ConsoleGroup {
  key?: string;
  group: string;
  lines: ConsoleGroupLines;
}

export type ConsoleGroupLines = (
  | ConsoleLine
  | ConsoleLine[]
  | ConsoleLine[][]
)[];

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
