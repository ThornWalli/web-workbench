import type { CallbackOptions } from '../BasicInterpreter';

export interface ExecuteCallbackOptions extends CallbackOptions {
  show?: boolean;
}

export interface FirebaseConfig {
  apiKey: string;
  url: string;
}
