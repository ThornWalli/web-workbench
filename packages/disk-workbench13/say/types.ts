import type { ItemModel } from '@web-workbench/core/classes/MenuItem/Interaction';

export interface Options {
  voice: SpeechSynthesisVoice;
  rate: number;
  pitch: number;
}

export interface Model extends ItemModel {
  playing?: boolean;
  paused?: boolean;
  value: string;
  presetLanguage?: string;
  displayLanguage?: string;
  options: Options;
  actions?: {
    close: () => void;
    play: (value?: string) => void;
    stop: () => void;
    pause: () => void;
    openOptions: () => void;
    setOptions: (options: Partial<Options>) => void;
    openPresets: () => void;
    openInfo: () => void;
  };
}
