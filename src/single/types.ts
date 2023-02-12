import type { WRITABLE_OSCILLATOR_TYPES } from "./constants";

export type TSynthOptions = OscillatorOptions &
  GainOptions & {
    midi?: number;
    start?: number;
    end?: number;
    attack?: number;
    decay?: number;
    delay?: number;
    onEnded?(isDone: boolean): void;
    master?: GainNode;
  };

export type TWritableOscillatorTypeTuple =
  typeof WRITABLE_OSCILLATOR_TYPES;

export type TWritableOscillatorType = Exclude<
  OscillatorType,
  "custom"
>;

export type TWritableOscillatorTypeKey =
  TWritableOscillatorTypeTuple[number];

export type TStopOptions = Pick<
  TSynthOptions,
  "gain" | "decay" | "end" | "onEnded" | "delay"
>;
