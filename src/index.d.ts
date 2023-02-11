declare type TSynthOptions = OscillatorOptions &
  GainOptions & {
    midi?: number;
    start?: number;
    end?: number;
    attack?: number;
    decay?: number;
    onEnded?(): void;
    master?: GainNode;
  };

declare type TStopOptions = Pick<
  TSynthOptions,
  "gain" | "decay" | "end" | "onEnded"
>;

interface TSingleSynthReturn {
  play(options?: TSynthOptions): void;
  stop(options?: TStopOptions): void;
}

declare function useSingleSynth(
  context: AudioContext,
  options: TSynthOptions,
): TSingleSynthReturn;
