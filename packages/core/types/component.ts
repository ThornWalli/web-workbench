import type Window from '../classes/Window';

export interface TriggerRefresh {
  reset?: boolean;
  scroll?: boolean;
  resize?: boolean;
}

export interface WindowEventContext {
  id: string;
  scope: Window;
  focused: boolean;
  refresh: (options?: TriggerRefresh) => void;
}

export interface WindowCloseEventContext extends WindowEventContext {
  componentData?: unknown;
}
