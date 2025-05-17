export interface Options {
  voice: SpeechSynthesisVoice;
  rate: number;
  pitch: number;
}

export interface Model {
  playing?: boolean;
  paused?: boolean;
  value: string;
  options: Options;
  actions?: {
    close: () => void;
    play: () => void;
    stop: () => void;
    pause: () => void;
    openOptions: () => void;
    openInfo: () => void;
    setOptions: (options: Partial<Options>) => void;
  };
}
